package com.hekr.store.utils;

import java.math.BigDecimal;

import com.hekr.store.model.cart.Cart;

public class Utils {
    public static BigDecimal calculatePrice(Cart c) {
        boolean isWholesale = c.getProductVariant().getProduct().getWholesaleThreshold() <= c.getQuantity();
        BigDecimal priceWholesale = c.getProductVariant().getProduct().getPriceWholesale();
        BigDecimal priceRetail = c.getProductVariant().getProduct().getPriceRetail();
        BigDecimal totalPrice = isWholesale ? priceWholesale : priceRetail;
        return totalPrice;
    }
}
