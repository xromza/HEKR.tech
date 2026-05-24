package com.hekr.store.service;

import com.hekr.store.dto.product.ProductResponseDto;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.repository.ProductRepository;
import com.hekr.store.repository.ProductVariantsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductVariantsRepository productVariantsRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private ProductVariant testVariant;

    @BeforeEach
    void setUp() {
        testProduct = Product.builder()
                .id(1L)
                .title("Тестовый товар")
                .description("Описание тестового товара")
                .isActive(true)
                .brand("ТестБренд")
                .build();

        testVariant = ProductVariant.builder()
                .id(10000L)
                .product(testProduct)
                .color("Красный")
                .size("M")
                .build();
    }

    @Nested
    @DisplayName("Тесты получения товара по ID (getProductDtoById)")
    class GetProductDtoByIdTests {

        @Test
        @DisplayName("Успешное получение товара по ID")
        void getProductDtoById_Success_ReturnsProduct() {
            // Arrange
            when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

            // Act
            ProductResponseDto result = productService.getProductDtoById(1L);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getTitle()).isEqualTo("Тестовый товар");
            verify(productRepository).findById(1L);
        }

        @Test
        @DisplayName("Негативный: товар не найден")
        void getProductDtoById_NotFound_ThrowsException() {
            // Arrange
            when(productRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> productService.getProductDtoById(999L))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("Товар с id 999 не найден");

            verify(productRepository).findById(999L);
        }
    }

    @Nested
    @DisplayName("Тесты получения варианта товара (getProductVariantById)")
    class GetProductVariantByIdTests {

        @Test
        @DisplayName("Успешное получение варианта товара")
        void getProductVariantById_Success_ReturnsVariant() {
            // Arrange
            when(productVariantsRepository.findById(10000L)).thenReturn(Optional.of(testVariant));

            // Act
            ProductVariant result = productService.getProductVariantById(10000L);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(10000L);
            assertThat(result.getColor()).isEqualTo("Красный");
            assertThat(result.getSize()).isEqualTo("M");
            verify(productVariantsRepository).findById(10000L);
        }

        @Test
        @DisplayName("Негативный: вариант товара не найден")
        void getProductVariantById_NotFound_ThrowsException() {
            // Arrange
            when(productVariantsRepository.findById(99999L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> productService.getProductVariantById(99999L))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("Вариант товара не найден");

            verify(productVariantsRepository).findById(99999L);
        }
    }

    @Nested
    @DisplayName("Тесты подсчёта товаров по категории (countByCategoryId)")
    class CountByCategoryIdTests {

        @Test
        @DisplayName("Успешный подсчёт товаров в категории")
        void countByCategoryId_Success_ReturnsCount() {
            // Arrange
            when(productRepository.countProductsByCategoryId(100L)).thenReturn(5L);

            // Act
            Long result = productService.countByCategoryId(100L);

            // Assert
            assertThat(result).isEqualTo(5L);
            verify(productRepository).countProductsByCategoryId(100L);
        }

        @Test
        @DisplayName("Подсчёт в пустой категории")
        void countByCategoryId_Empty_ReturnsZero() {
            // Arrange
            when(productRepository.countProductsByCategoryId(200L)).thenReturn(0L);

            // Act
            Long result = productService.countByCategoryId(200L);

            // Assert
            assertThat(result).isZero();
            verify(productRepository).countProductsByCategoryId(200L);
        }
    }

    @Nested
    @DisplayName("Тесты подсчёта товаров со скидкой (countWithSale)")
    class CountWithSaleTests {

        @Test
        @DisplayName("Успешный подсчёт товаров со скидкой")
        void countWithSale_Success_ReturnsCount() {
            // Arrange
            when(productRepository.countProductWithSale()).thenReturn(3L);

            // Act
            Long result = productService.countWithSale();

            // Assert
            assertThat(result).isEqualTo(3L);
            verify(productRepository).countProductWithSale();
        }

        @Test
        @DisplayName("Нет товаров со скидкой")
        void countWithSale_NoSales_ReturnsZero() {
            // Arrange
            when(productRepository.countProductWithSale()).thenReturn(0L);

            // Act
            Long result = productService.countWithSale();

            // Assert
            assertThat(result).isZero();
            verify(productRepository).countProductWithSale();
        }
    }

    @Nested
    @DisplayName("Тесты подсчёта брендов (countBrands)")
    class CountBrandsTests {

        @Test
        @DisplayName("Успешный подсчёт уникальных брендов")
        void countBrands_Success_ReturnsCount() {
            // Arrange
            when(productRepository.countDistinctBrands()).thenReturn(7L);

            // Act
            Long result = productService.countBrands();

            // Assert
            assertThat(result).isEqualTo(7L);
            verify(productRepository).countDistinctBrands();
        }

        @Test
        @DisplayName("Нет брендов в каталоге")
        void countBrands_NoBrands_ReturnsZero() {
            // Arrange
            when(productRepository.countDistinctBrands()).thenReturn(0L);

            // Act
            Long result = productService.countBrands();

            // Assert
            assertThat(result).isZero();
            verify(productRepository).countDistinctBrands();
        }
    }
}