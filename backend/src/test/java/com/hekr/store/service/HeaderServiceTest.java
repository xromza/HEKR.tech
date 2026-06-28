package com.hekr.store.service;

import com.hekr.store.dto.header.HeaderResponseDto;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HeaderServiceTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private HeaderService headerService;

    @Nested
    @DisplayName("Тесты получения заголовка (getHeader)")
    class GetHeaderTests {

        @Test
        @DisplayName("Успешное получение заголовка со всеми данными")
        void getHeader_Success_ReturnsHeaderWithAllData() {
            // Arrange
            when(productService.countByCategoryId(1L)).thenReturn(10L);
            when(productService.countByCategoryId(2L)).thenReturn(7L);
            when(productService.countByCategoryId(3L)).thenReturn(12L);

            // Act
            HeaderResponseDto result = headerService.getHeader();

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getAccessoriesCount()).isEqualTo(12L);
            assertThat(result.getManCount()).isEqualTo(10L);
            assertThat(result.getWomenCount()).isEqualTo(7L);

            verify(productService).countByCategoryId(3L);
            verify(productService).countByCategoryId(1L);
            verify(productService).countByCategoryId(2L);
        }

        @Test
        @DisplayName("Успешное получение заголовка с нулевыми значениями")
        void getHeader_AllCountsZero_ReturnsHeaderWithZeros() {
            // Arrange
            when(productService.countByCategoryId(3L)).thenReturn(0L);
            when(productService.countByCategoryId(1L)).thenReturn(0L);
            when(productService.countByCategoryId(2L)).thenReturn(0L);

            // Act
            HeaderResponseDto result = headerService.getHeader();

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getAccessoriesCount()).isZero();
            assertThat(result.getManCount()).isZero();
            assertThat(result.getWomenCount()).isZero();

            verify(productService).countByCategoryId(3L);
            verify(productService).countByCategoryId(1L);
            verify(productService).countByCategoryId(2L);
        }

        @Test
        @DisplayName("Edge-case: большие значения счетчиков")
        void getHeader_LargeCounts_ReturnsHeaderWithLargeValues() {
            // Arrange
            when(productService.countByCategoryId(3L)).thenReturn(500L);
            when(productService.countByCategoryId(1L)).thenReturn(1500L);
            when(productService.countByCategoryId(2L)).thenReturn(800L);

            // Act
            HeaderResponseDto result = headerService.getHeader();

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getAccessoriesCount()).isEqualTo(500L);
            assertThat(result.getManCount()).isEqualTo(1500L);
            assertThat(result.getWomenCount()).isEqualTo(800L);
        }

        @Test
        @DisplayName("Проверка, что все методы ProductService вызываются ровно один раз")
        void getHeader_AllProductServiceMethodsCalledOnce() {
            // Arrange
            when(productService.countByCategoryId(3L)).thenReturn(1L);
            when(productService.countByCategoryId(1L)).thenReturn(1L);
            when(productService.countByCategoryId(2L)).thenReturn(1L);

            // Act
            headerService.getHeader();

            // Assert
            verify(productService, times(1)).countByCategoryId(3L);
            verify(productService, times(1)).countByCategoryId(1L);
            verify(productService, times(1)).countByCategoryId(2L);
        }

        @Test
        @DisplayName("Проверка, что для женских и мужских товаров используются правильные ID категорий")
        void getHeader_UsesCorrectCategoryIds() {
            // Arrange
            when(productService.countByCategoryId(anyLong())).thenReturn(0L);

            // Act
            headerService.getHeader();

            // Assert
            verify(productService).countByCategoryId(1L); // мужские товары
            verify(productService).countByCategoryId(2L); // женские товары
            verify(productService).countByCategoryId(3L); // акссесуары 
        }
    }
}