package com.hekr.store.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.hekr.store.dto.discount.DiscountDto;
import com.hekr.store.mapper.discount.DiscountMapper;
import com.hekr.store.model.category.Category;
import com.hekr.store.model.discount.Discount;
import com.hekr.store.repository.DiscountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiscountService {

    private final DiscountRepository discountRepository;
    private final CategoryService categoryService;
    private final DiscountMapper discountMapper;

    public DiscountDto updateDiscount(Long categoryId, BigDecimal discountAmount) {
        Category category = categoryService.getCategoryById(categoryId);
        Discount discount = Discount.builder()
                .category(category)
                .discount(discountAmount)
                .build();
        return discountMapper.toDto(discountRepository.save(discount));
    }
}
