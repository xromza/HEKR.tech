package com.hekr.store.service;

import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.model.stock.Stock;
import com.hekr.store.model.stock.StockId;
import com.hekr.store.model.warehouse.Warehouse;
import com.hekr.store.repository.StockRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StockServiceTest {

    @Mock
    private StockRepository stockRepository;

    @InjectMocks
    private StockService stockService;

    private Product testProduct;
    private ProductVariant testVariant;
    private Warehouse testWarehouse;
    private Stock testStock;
    private StockId testStockId;

    @BeforeEach
    void setUp() {
        testProduct = Product.builder()
                .id(100L)
                .title("Тестовый товар")
                .build();

        testVariant = ProductVariant.builder()
                .id(1000L)
                .product(testProduct)
                .color("Красный")
                .size("M")
                .build();

        testWarehouse = Warehouse.builder()
                .id(200L)
                .build();

        testStockId = new StockId(1000L, 200L);

        testStock = Stock.builder()
                .variant(testVariant)
                .warehouse(testWarehouse)
                .quantity(50)
                .build();
    }

    @Nested
    @DisplayName("Тесты получения остатков по варианту товара (getByVariantId)")
    class GetByVariantIdTests {

        @Test
        @DisplayName("Успешное получение остатков по ID варианта товара")
        void getByVariantId_Success_ReturnsStockList() {
            // Arrange
            List<Stock> expectedStocks = List.of(testStock);
            when(stockRepository.findAllByVariantId(1000L)).thenReturn(expectedStocks);

            // Act
            List<Stock> result = stockService.getByVariantId(1000L);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result).hasSize(1);
            assertThat(result.get(0)).isEqualTo(testStock);
            verify(stockRepository).findAllByVariantId(1000L);
        }

        @Test
        @DisplayName("Успешное получение пустого списка если нет остатков")
        void getByVariantId_NoStocks_ReturnsEmptyList() {
            // Arrange
            when(stockRepository.findAllByVariantId(9999L)).thenReturn(List.of());

            // Act
            List<Stock> result = stockService.getByVariantId(9999L);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result).isEmpty();
            verify(stockRepository).findAllByVariantId(9999L);
        }

        @Test
        @DisplayName("Edge-case: передача null в variantId")
        void getByVariantId_NullId_ReturnsEmptyList() {
            // Arrange
            when(stockRepository.findAllByVariantId(null)).thenReturn(List.of());

            // Act
            List<Stock> result = stockService.getByVariantId(null);

            // Assert
            assertThat(result).isEmpty();
            verify(stockRepository).findAllByVariantId(null);
        }
    }

    @Nested
    @DisplayName("Тесты получения остатков по варианту товара и складу (getByVariantIdAndWarehouseId)")
    class GetByVariantIdAndWarehouseIdTests {

        @Test
        @DisplayName("Успешное получение остатков по variantId и warehouseId")
        void getByVariantIdAndWarehouseId_Success_ReturnsStock() {
            // Arrange
            when(stockRepository.findById(testStockId)).thenReturn(Optional.of(testStock));

            // Act
            Stock result = stockService.getByVariantIdAndWarehouseId(1000L, 200L);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getVariant()).isEqualTo(testVariant);
            assertThat(result.getWarehouse()).isEqualTo(testWarehouse);
            assertThat(result.getQuantity()).isEqualTo(50);
            verify(stockRepository).findById(testStockId);
        }

        @Test
        @DisplayName("Негативный: остатки не найдены")
        void getByVariantIdAndWarehouseId_NotFound_ThrowsNotFoundException() {
            // Arrange
            StockId nonExistentId = new StockId(9999L, 9999L);
            when(stockRepository.findById(nonExistentId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> stockService.getByVariantIdAndWarehouseId(9999L, 9999L))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("Данный вариант товара не найден на складе");

            verify(stockRepository).findById(nonExistentId);
        }

        @Test
        @DisplayName("Edge-case: variantId существует, warehouseId не существует")
        void getByVariantIdAndWarehouseId_WarehouseNotFound_ThrowsNotFoundException() {
            // Arrange
            StockId nonExistentId = new StockId(1000L, 9999L);
            when(stockRepository.findById(nonExistentId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> stockService.getByVariantIdAndWarehouseId(1000L, 9999L))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("Данный вариант товара не найден на складе");

            verify(stockRepository).findById(nonExistentId);
        }

        @Test
        @DisplayName("Edge-case: передача null в параметры")
        void getByVariantIdAndWarehouseId_NullParams_ThrowsException() {
            // Arrange
            StockId nullId = new StockId(null, null);
            when(stockRepository.findById(nullId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> stockService.getByVariantIdAndWarehouseId(null, null))
                    .isInstanceOf(NotFoundException.class);

            verify(stockRepository).findById(any(StockId.class));
        }
    }

    @Nested
    @DisplayName("Тесты сохранения остатков (saveStock)")
    class SaveStockTests {

        @Test
        @DisplayName("Успешное сохранение остатков")
        void saveStock_Success_SavesStock() {
            // Arrange
            when(stockRepository.save(testStock)).thenReturn(testStock);

            // Act
            stockService.saveStock(testStock);

            // Assert
            verify(stockRepository, times(1)).save(testStock);
        }

        @Test
        @DisplayName("Сохранение нового остатка")
        void saveStock_NewStock_SavesNewStock() {
            // Arrange
            Stock newStock = Stock.builder()
                    .variant(testVariant)
                    .warehouse(testWarehouse)
                    .quantity(10)
                    .build();

            when(stockRepository.save(newStock)).thenReturn(newStock);

            // Act
            stockService.saveStock(newStock);

            // Assert
            ArgumentCaptor<Stock> stockCaptor = ArgumentCaptor.forClass(Stock.class);
            verify(stockRepository).save(stockCaptor.capture());
            Stock capturedStock = stockCaptor.getValue();
            assertThat(capturedStock.getQuantity()).isEqualTo(10);
            assertThat(capturedStock.getVariant()).isEqualTo(testVariant);
            assertThat(capturedStock.getWarehouse()).isEqualTo(testWarehouse);
        }

        @Test
        @DisplayName("Обновление существующего остатка")
        void saveStock_UpdateExistingStock_UpdatesStock() {
            // Arrange
            testStock.setQuantity(25);
            when(stockRepository.save(testStock)).thenReturn(testStock);

            // Act
            stockService.saveStock(testStock);

            // Assert
            verify(stockRepository).save(testStock);
        }

        @Test
        @DisplayName("Edge-case: сохранение с нулевым количеством")
        void saveStock_ZeroQuantity_SavesStock() {
            // Arrange
            testStock.setQuantity(0);
            when(stockRepository.save(testStock)).thenReturn(testStock);

            // Act
            stockService.saveStock(testStock);

            // Assert
            ArgumentCaptor<Stock> stockCaptor = ArgumentCaptor.forClass(Stock.class);
            verify(stockRepository).save(stockCaptor.capture());
            assertThat(stockCaptor.getValue().getQuantity()).isZero();
        }

        @Test
        @DisplayName("Edge-case: сохранение с отрицательным количеством")
        void saveStock_NegativeQuantity_SavesStock() {
            // Arrange
            testStock.setQuantity(-5);
            when(stockRepository.save(testStock)).thenReturn(testStock);

            // Act
            stockService.saveStock(testStock);

            // Assert
            ArgumentCaptor<Stock> stockCaptor = ArgumentCaptor.forClass(Stock.class);
            verify(stockRepository).save(stockCaptor.capture());
            assertThat(stockCaptor.getValue().getQuantity()).isEqualTo(-5);
        }
    }
}