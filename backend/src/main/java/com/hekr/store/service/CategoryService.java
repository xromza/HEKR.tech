package com.hekr.store.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.category.CategoryRequestDto;
import com.hekr.store.dto.category.CategoryResponseDto;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.mapper.category.CategoryRequestMapper;
import com.hekr.store.mapper.category.CategoryResponseMapper;
import com.hekr.store.model.category.Category;
import com.hekr.store.repository.CategoryRepository;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryResponseMapper categoryResponseMapper;
    private final CategoryRequestMapper categoryRequestMapper;

    public CategoryResponseDto getCategoryDtoById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Категория товара не найдена"));
        return categoryResponseMapper.toDto(category);
    }

    public Boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }

    protected Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Категория товара не найдена"));
    }

    public List<CategoryResponseDto> getAllCategories() {
        return categoryResponseMapper.toResponseList(categoryRepository.findAll());
    }

    @Transactional
    public CategoryResponseDto createCategory(CategoryRequestDto dto) {
        if (existsByName(dto.getName())) {
            throw new EntityExistsException("Такая категория уже существует");
        }
        Category category = categoryRequestMapper.toEntity(dto);
        return categoryResponseMapper.toDto(categoryRepository.save(category));
    }
}
