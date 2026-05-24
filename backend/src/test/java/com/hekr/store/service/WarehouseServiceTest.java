package com.hekr.store.service;

import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.model.warehouse.Warehouse;
import com.hekr.store.repository.WarehouseRepository;
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
class WarehouseServiceTest {

    @Mock
    private WarehouseRepository warehouseRepository;

    @InjectMocks
    private WarehouseService warehouseService;

    private Warehouse testWarehouse;

    @BeforeEach
    void setUp() {
        testWarehouse = Warehouse.builder()
                .id(100L)
                .build();
    }

    @Nested
    @DisplayName("Тесты поиска склада по ID (findById)")
    class FindByIdTests {

        @Test
        @DisplayName("Успешное получение склада по ID")
        void findById_Success_ReturnsWarehouse() {
            // Arrange
            when(warehouseRepository.findById(100L)).thenReturn(Optional.of(testWarehouse));

            // Act
            Warehouse result = warehouseService.findById(100L);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(100L);
            verify(warehouseRepository).findById(100L);
        }

        @Test
        @DisplayName("Негативный: склад не найден")
        void findById_NotFound_ThrowsNotFoundException() {
            // Arrange
            when(warehouseRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> warehouseService.findById(999L))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("Склад не найден");

            verify(warehouseRepository).findById(999L);
        }

        @Test
        @DisplayName("Edge-case: поиск по null ID")
        void findById_NullId_ThrowsNotFoundException() {
            // Arrange
            when(warehouseRepository.findById(null)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> warehouseService.findById(null))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("Склад не найден");

            verify(warehouseRepository).findById(null);
        }

        @Test
        @DisplayName("Edge-case: поиск по отрицательному ID")
        void findById_NegativeId_ThrowsNotFoundException() {
            // Arrange
            Long negativeId = -1L;
            when(warehouseRepository.findById(negativeId)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> warehouseService.findById(negativeId))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("Склад не найден");

            verify(warehouseRepository).findById(negativeId);
        }

        @Test
        @DisplayName("Edge-case: поиск по ID = 0")
        void findById_ZeroId_ThrowsNotFoundException() {
            // Arrange
            when(warehouseRepository.findById(0L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> warehouseService.findById(0L))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("Склад не найден");

            verify(warehouseRepository).findById(0L);
        }
    }
}