-- =============================================================================
-- 1. СПРАВОЧНИКИ
-- =============================================================================

INSERT INTO public.categories (id, name) VALUES
(1, 'Худи и Толстовки'),
(2, 'Футболки'),
(3, 'Джинсы и Брюки'),
(4, 'Аксессуары');

INSERT INTO public.warehouses (id, address) VALUES
(1, 'г. Москва, ул. Складская, д. 1 (Основной)'),
(2, 'г. Санкт-Петербург, Промзона 4 (Резерв)');

-- Пароль у всех пользователей: password (BCrypt hash)
INSERT INTO public.users (id, login, password_hash, role, is_approved, client_type, phone, email) VALUES
(1, 'admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGFgw2FIHkUGOaU.e0lK', 'ADMIN', true, 'INDIVIDUAL', '+79990001122', 'admin@hekr.tech'),
(2, 'ivan_user', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGFgw2FIHkUGOaU.e0lK', 'USER', true, 'INDIVIDUAL', '+79001234567', 'ivan@gmail.com'),
(3, 'ooo_zarya', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGFgw2FIHkUGOaU.e0lK', 'USER', true, 'LEGAL', '+78129998877', 'opt@zarya.ru');

-- =============================================================================
-- 2. ПРОФИЛИ ПОЛЬЗОВАТЕЛЕЙ
-- =============================================================================

INSERT INTO public.individual_details (user_id, first_name, last_name, midname, birthdate, passport_series, passport_number) VALUES
(1, 'Кирилл', 'Админов', 'Денисович', '1995-05-15', '1234', '567890'),
(2, 'Иван', 'Иванов', 'Иванович', '2000-10-20', '4321', '098765');

INSERT INTO public.legal_details (user_id, company_name, inn, kpp, ogrn, legal_address) VALUES
(3, 'ООО "Заря"', '7712345678', '770101001', '1027700132195', 'г. Москва, ул. Ленина, д. 10, офис 42');

-- =============================================================================
-- 3. ТОВАРЫ И ЦЕНООБРАЗОВАНИЕ
-- =============================================================================

INSERT INTO public.products (id, category_id, title, description, price_retail, price_wholesale, wholesale_threshold, is_active) VALUES
(1, 1, 'Худи Oversize Базовое', 'Плотное худи из футера с начесом. Идеально на каждый день.', 4500.00, 3200.00, 10, true),
(2, 2, 'Футболка Classic Print', 'Хлопковая футболка с минималистичным принтом.', 1500.00, 900.00, 20, true),
(3, 3, 'Джинсы Straight Fit', 'Прямые классические джинсы синего цвета.', 5200.00, 3800.00, 15, true);

INSERT INTO public.product_variants (id, product_id, size, color, weight, sku, is_active) VALUES
(1, 1, 'M', 'Черный', 0.80, 'HD-OVR-BLK-M', true),
(2, 1, 'L', 'Черный', 0.85, 'HD-OVR-BLK-L', true),
(3, 1, 'M', 'Белый', 0.80, 'HD-OVR-WHT-M', true),
(4, 2, 'S', 'Серый', 0.20, 'TS-CLS-GRY-S', true),
(5, 2, 'M', 'Серый', 0.22, 'TS-CLS-GRY-M', true),
(6, 3, '32/32', 'Синий', 0.60, 'JN-STR-BLU-32', true);

INSERT INTO public.images (id, url, product_variant_id, type, sort_order) VALUES
(1, 'https://example.com/images/hoodie_blk_main.jpg', 1, 'MAIN', 0),
(2, 'https://example.com/images/hoodie_blk_back.jpg', 1, 'GALLERY', 1),
(3, 'https://example.com/images/hoodie_wht_main.jpg', 3, 'MAIN', 0);

-- Скидка 15% на аксессуары
INSERT INTO public.discounts (category_id, discount) VALUES
(4, 0.15); 

-- =============================================================================
-- 4. СКЛАДСКОЙ УЧЕТ (STOCK)
-- =============================================================================

INSERT INTO public.stock (variant_id, warehouse_id, quantity) VALUES
(1, 1, 50),  -- Худи М черное на основном складе
(1, 2, 10),  -- Худи М черное на резервном складе
(2, 1, 30),  -- Худи L черное
(3, 1, 25),  -- Худи М белое
(4, 1, 100), -- Футболки S
(5, 1, 80),  -- Футболки M
(6, 1, 45);  -- Джинсы

-- =============================================================================
-- 5. КОРЗИНА И ЗАКАЗЫ
-- =============================================================================

-- Ваня закинул в корзину черное худи(L) и джинсы
INSERT INTO public.carts (user_id, variant_id, quantity) VALUES
(2, 2, 1),
(2, 6, 1);

-- Заказ 1: Обычный розничный клиент (CASH, NEW)
INSERT INTO public.orders (id, user_id, warehouse_id, price, address, status, payment_method, comment) VALUES
(1, 2, 1, 6000.00, 'г. Москва, ул. Пушкина, д. 10, кв. 5', 'NEW', 'CASH', 'Позвонить за час до доставки');

INSERT INTO public.order_items (order_id, variant_id, quantity, price_at_purchase, total_price) VALUES
(1, 1, 1, 4500.00, 4500.00),
(1, 4, 1, 1500.00, 1500.00);

INSERT INTO public.order_status_history (order_id, new_status, changed_by, comment) VALUES
(1, 'NEW', 2, 'Заказ создан клиентом');

-- Заказ 2: Оптовик (INVOICE, IN_PROGRESS)
INSERT INTO public.orders (id, user_id, warehouse_id, price, address, status, payment_method, comment) VALUES
(2, 3, 1, 32000.00, 'г. Москва, ул. Ленина, д. 10', 'IN_PROGRESS', 'INVOICE', 'Отгрузка транспортной компанией');

INSERT INTO public.order_items (order_id, variant_id, quantity, price_at_purchase, total_price) VALUES
(2, 1, 10, 3200.00, 32000.00); -- Оптовая цена!

INSERT INTO public.order_status_history (order_id, new_status, changed_by, comment) VALUES
(2, 'NEW', 3, 'Оптовый заказ оформлен'),
(2, 'IN_PROGRESS', 1, 'Счет оплачен, собираем на складе');

-- =============================================================================
-- 6. ОБНОВЛЕНИЕ СИКВЕНСОВ (КРИТИЧНО ДЛЯ POSTGRESQL)
-- =============================================================================
-- Так как мы вставили ID вручную (1, 2, 3), нужно сказать базе, 
-- чтобы следующие сгенерированные ID начинались с больших значений,
-- иначе при создании нового товара через API база попытается создать ID=1 и упадет с ошибкой.

SELECT setval('public.categories_id_seq', (SELECT MAX(id) FROM public.categories));
SELECT setval('public.warehouses_id_seq', (SELECT MAX(id) FROM public.warehouses));
SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM public.users));
SELECT setval('public.products_id_seq', (SELECT MAX(id) FROM public.products));
SELECT setval('public.product_variants_id_seq', (SELECT MAX(id) FROM public.product_variants));
SELECT setval('public.images_id_seq', (SELECT MAX(id) FROM public.images));
SELECT setval('public.orders_id_seq', (SELECT MAX(id) FROM public.orders));