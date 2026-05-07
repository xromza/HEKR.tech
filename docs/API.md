# Спецификация API (v1)

Данный документ описывает эндпоинты для взаимодействия фронтенда с бэкендом на Spring Boot. 

## Базовый URL
`https://hekr.tech/api/v1`

---

## 1. Каталог товаров (Catalog)
Работа с витриной и поиском.

### 1.1. Получить список карточек всех товаров
**Метод:** `GET`  
**Путь:** `/products`  
**Доступ:** Всем  

#### Параметры запроса (Query Parameters)
Используются для фильтрации и управления отображением списка. Все параметры являются опциональными.

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **sort** | `string` | Поле и направление сортировки (`asc` — возр., `desc` — убыв.). | `?sort=price,asc` |
| **page** | `int` | Номер страницы для пагинации (начиная с 0). | `?page=0` |
| **size** | `int` | Количество записей на одной странице. | `?size=10` |
| **verbose** | `boolean` | Подробный ответ | `?verbose=1` |

**Успешный ответ Verbose = 0 (200 OK):**
```json
{
    "content": [
        {
            "id": 1,
            "brand": "Gucci",
            "title": "Бомбер GG Marmont",
            "categoryId": 1,
            "categoryName": "Мужская одежда",
            "isActive": true,
            "priceWholesale": 140000.00,
            "priceRetail": 185000.00,
            "mainImageUrl": "https://lux-cdn.example.com/gucci_bomber_blk_thumb.jpg"
        },
        {
            "id": 10,
            "brand": "Moncler",
            "title": "Ботинки Trailgrip",
            "categoryId": 4,
            "categoryName": "Обувь",
            "isActive": true,
            "priceWholesale": 75000.00,
            "priceRetail": 105000.00,
            "mainImageUrl": "https://lux-cdn.example.com/moncler_trailgrip_main.jpg"
        },
        {
            "id": 4,
            "brand": "Maison Margiela",
            "title": "Деконструированное платье",
            "categoryId": 2,
            "categoryName": "Женская одежда",
            "isActive": true,
            "priceWholesale": 110000.00,
            "priceRetail": 155000.00,
            "mainImageUrl": "https://lux-cdn.example.com/margiela_dress_beg_thumb.jpg"
        },
        {
            "id": 8,
            "brand": "Prada",
            "title": "Клатч Saffiano",
            "categoryId": 3,
            "categoryName": "Аксессуары",
            "isActive": true,
            "priceWholesale": 55000.00,
            "priceRetail": 78000.00,
            "mainImageUrl": "https://lux-cdn.example.com/prada_clutch_blk_main.jpg"
        },
        {
            "id": 5,
            "brand": "Gucci",
            "title": "Костюм из шерсти Super 120",
            "categoryId": 2,
            "categoryName": "Женская одежда",
            "isActive": true,
            "priceWholesale": 150000.00,
            "priceRetail": 210000.00,
            "mainImageUrl": "https://lux-cdn.example.com/gucci_suit_blk_main.jpg"
        },
        {
            "id": 9,
            "brand": "Maison Margiela",
            "title": "Кроссовки Replica",
            "categoryId": 4,
            "categoryName": "Обувь",
            "isActive": true,
            "priceWholesale": 48000.00,
            "priceRetail": 68000.00,
            "mainImageUrl": "https://lux-cdn.example.com/margiela_replica_main.jpg"
        }
    ],
    "empty": false,
    "first": true,
    "last": false,
    "number": 0,
    "numberOfElements": 6,
    "pageable": {
        "offset": 0,
        "pageNumber": 0,
        "pageSize": 6,
        "paged": true,
        "sort": {
            "empty": false,
            "sorted": true,
            "unsorted": false
        },
        "unpaged": false
    },
    "size": 6,
    "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
    },
    "totalElements": 10,
    "totalPages": 2
}
```

### 1.2. Найти товары по имени
**Метод:** `GET`  
**Путь:** `/products/search`  
**Доступ:** Всем  

#### Параметры запроса (Query Parameters)

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **query** | `string` | Строка поиска. | `?query=худи` |
| **sort** | `string` | Поле и направление сортировки. | `?sort=priceRetail,asc` |
| **page** | `int` | Номер страницы для пагинации (начиная с 0). | `?page=0` |
| **size** | `int` | Количество записей на одной странице. | `?size=10` |
| **verbose** | `boolean` | Подробный ответ | `?verbose=1` |

**Успешный ответ *Query = G* *Verbose = 0* (200 OK):**
```json
{
    "content": [
        {
            "id": 1,
            "brand": "Gucci",
            "title": "Бомбер GG Marmont",
            "categoryId": 1,
            "categoryName": "Мужская одежда",
            "isActive": true,
            "priceWholesale": 140000.00,
            "priceRetail": 185000.00,
            "mainImageUrl": "https://lux-cdn.example.com/gucci_bomber_blk_thumb.jpg"
        },
        {
            "id": 7,
            "brand": "Gucci",
            "title": "Ремень GG Marmont 4 см",
            "categoryId": 3,
            "categoryName": "Аксессуары",
            "isActive": true,
            "priceWholesale": 35000.00,
            "priceRetail": 48000.00,
            "mainImageUrl": "https://lux-cdn.example.com/gucci_belt_blk_main.jpg"
        },
        {
            "id": 10,
            "brand": "Moncler",
            "title": "Ботинки Trailgrip",
            "categoryId": 4,
            "categoryName": "Обувь",
            "isActive": true,
            "priceWholesale": 75000.00,
            "priceRetail": 105000.00,
            "mainImageUrl": "https://lux-cdn.example.com/moncler_trailgrip_main.jpg"
        }
    ],
    "empty": false,
    "first": true,
    "last": true,
    "number": 0,
    "numberOfElements": 3,
    "pageable": {
        "offset": 0,
        "pageNumber": 0,
        "pageSize": 6,
        "paged": true,
        "sort": {
            "empty": false,
            "sorted": true,
            "unsorted": false
        },
        "unpaged": false
    },
    "size": 6,
    "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
    },
    "totalElements": 3,
    "totalPages": 1
}
```

### 1.3. Информация о товаре
Получение детальной информации о модели товара, списке доступных модификаций и остатках.

**Метод:** `GET`  
**Путь:** `/products/{id}`  
**Доступ:** Все пользователи  

**Параметры запроса (Query Parameters):**
| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **variantId** | `long` | ID конкретной модификации. | `?variantId=4` |

**Успешный ответ (200 OK):**
```json
{
    "id": 1,
    "brand": "Gucci",
    "title": "Бомбер GG Marmont",
    "description": "Классический бомбер из технической ткани с вышивкой и нашивкой.",
    "categoryId": 1,
    "categoryName": "Мужская одежда",
    "isActive": true,
    "priceWholesale": 140000.00,
    "priceRetail": 185000.00,
    "wholesaleThreshold": 3,
    "variants": [
        {
            "id": 1,
            "productId": 1,
            "sku": "GUC-BMB-BLK-M",
            "size": "M",
            "color": "Черный",
            "weight": 0.90,
            "stock": [
                {
                    "variantId": 1,
                    "warehouseId": 2,
                    "address": "г. Санкт-Петербург, Невский пр., д. 15 (Северный хаб)",
                    "quantity": 2
                },
                {
                    "variantId": 1,
                    "warehouseId": 5,
                    "address": "г. Сочи, ул. Навагинская, д. 8 (Южный регион)",
                    "quantity": 1
                },
                {
                    "variantId": 1,
                    "warehouseId": 1,
                    "address": "г. Москва, ул. Петровка, д. 2 (Центральный хаб)",
                    "quantity": 3
                }
            ],
            "isActive": true,
            "images": [
                {
                    "id": 3,
                    "url": "https://lux-cdn.example.com/gucci_bomber_blk_back.jpg",
                    "type": "GALLERY",
                    "sortOrder": 1,
                    "createdAt": "2026-05-05T19:16:16.827122"
                },
                {
                    "id": 1,
                    "url": "https://lux-cdn.example.com/gucci_bomber_blk_main.jpg",
                    "type": "MAIN",
                    "sortOrder": 0,
                    "createdAt": "2026-05-05T19:16:16.827122"
                },
                {
                    "id": 2,
                    "url": "https://lux-cdn.example.com/gucci_bomber_blk_thumb.jpg",
                    "type": "THUMBNAIL",
                    "sortOrder": 0,
                    "createdAt": "2026-05-05T19:16:16.827122"
                }
            ]
        },
        {
            "id": 2,
            "productId": 1,
            "sku": "GUC-BMB-BLK-L",
            "size": "L",
            "color": "Черный",
            "weight": 0.95,
            "stock": [
                {
                    "variantId": 2,
                    "warehouseId": 1,
                    "address": "г. Москва, ул. Петровка, д. 2 (Центральный хаб)",
                    "quantity": 2
                },
                {
                    "variantId": 2,
                    "warehouseId": 3,
                    "address": "г. Казань, ул. Баумана, д. 44 (Поволжье)",
                    "quantity": 1
                }
            ],
            "isActive": true,
            "images": []
        },
        {
            "id": 3,
            "productId": 1,
            "sku": "GUC-BMB-NVY-XL",
            "size": "XL",
            "color": "Темно-синий",
            "weight": 1.00,
            "stock": [
                {
                    "variantId": 3,
                    "warehouseId": 6,
                    "address": "г. Екатеринбург, ул. Вайнера, д. 12 (Урал)",
                    "quantity": 1
                },
                {
                    "variantId": 3,
                    "warehouseId": 2,
                    "address": "г. Санкт-Петербург, Невский пр., д. 15 (Северный хаб)",
                    "quantity": 1
                }
            ],
            "isActive": true,
            "images": []
        }
    ],
    "mainImageUrl": "https://lux-cdn.example.com/gucci_bomber_blk_thumb.jpg"
}
```

## 2. Аутентификация (Auth)

### 2.1. Вход пользователя
**Метод:** `POST`  
**Путь:** `/auth/login`  
**Доступ:** Всем  
**Устанавливает Cookie:** refreshToken  

**Тело запроса:**
```json
{
  "login": "kirill_petrov",
  "password": "orapass"
}
```

**Успешный ответ (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "role": "CLIENT",
  "description": "Успешный вход"
}
```

### 2.2. Регистрация физического лица (INDIVIDUAL)
**Метод:** `POST`  
**Путь:** `/auth/registration`  
**Доступ:** Всем  
**Устанавливает Cookie:** refreshToken  
**Тело запроса:**
```json
{
    "login": "{{login}}",
    "password": "{{password}}",
    "phone": "{{phone}}",
    "email": "{{$randomEmail}}",
    "details": {
        "type": "INDIVIDUAL",
        "firstName": "{{firstName}}",
        "lastName": "{{lastName}}",
        "passportSeries": "{{passportSeries}}",
        "birthDate": "{{birthDate}}",
        "passportNumber": "{{passportNumber}}"
    }
}
```

**Успешный ответ (201 Created):**
```json
{
    "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dF91c2VyIiwiaWF0IjoxNzc4MDk4NTk5LCJleHAiOjE3NzgxODQ5OTl9.zNv1UjPbKiW6insSVA1Z1eGAMRjLNJIKhGmPFBgum_1Ty24cMBrnKxb_rjKoRC4Xrqll1DrompCe6xcnMruTBw",
    "type": "Bearer",
    "role": "CLIENT",
    "description": "Successful registered"
}
```

**Ошибка (409 Conflict)**
```json
{
    "error": "UserAlreadyExists",
    "description": "Аккаунт с данным email уже зарегистрирован"
}
```

**Ошибка (409 Conflict)**
```json
{
    "error": "UserAlreadyExists",
    "description": "Аккаунт с данным логином уже зарегистрирован"
}
```
### 2.3. Регистрация юридического лица (LEGAL)
**Метод:** `POST`  
**Путь:** `/auth/registration`  
**Доступ:** Всем  

**Тело запроса:**
```json
{
    "login": "{{login}}",
    "password": "{{password}}",
    "phone": "{{phone}}",
    "email": "{{email}}",
    "details": {
        "type": "LEGAL",
        "inn": "{{inn}}",
        "kpp": "{{kpp}}",
        "legalAddress": "{{legalAddress}}",
        "companyName": "{{companyName}}",
        "ogrn": "{{ogrn}}"
    }
}
```

**Успешный ответ (201 Created):**
```json
{
    "accessToken": <access_token>,
    "type": "Bearer",
    "role": "CLIENT",
    "description": "Successful registered"
}
```

### 2.4. Обновление токена (Refresh)
**Метод:** `POST`  
**Путь:** `/auth/refresh`  
**Доступ:** Авторизованный пользователь  
**Cookie:** refreshToken

**Успешный ответ (201 Created):**
```json
{
    "accessToken": <new_access_token>,
    "type": "Bearer",
    "role": "CLIENT",
    "description": "Token refreshed"
}
```

### 2.5. Выход из аккаунта (logout)
**Метод:** `POST`  
**Путь:** `/auth/logout`  
**Доступ:** Всем  
**Cookie:** refreshToken

**Успешный ответ (201 Created):**
```json
{
    "status": "Ok",
    "description": "Токен отозван"
}
```
**Удаляет cookie refreshToken**

## 3. Профиль (Profile)

### 3.1. Получить данные профиля (Юридическое лицо)
**Метод:** `GET`  
**Путь:** `/profile`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (200 OK):**
```json
{
    "id": 41,
    "login": "xromzas_software",
    "role": "CLIENT",
    "createdAt": "2026-05-07T19:05:27.586649",
    "isApproved": true,
    "clientType": "LEGAL",
    "email": "Sandrine60@gmail.com",
    "phone": "+71231231212",
    "details": {
        "companyName": "Lehner - Pollich",
        "inn": "123456789123",
        "kpp": "123456789",
        "ogrn": "1234567891234",
        "legalAddress": "г. Москва ул. Арбат 1"
    }
}
```

### 3.2. Получить данные профиля (Физическое лицо)
**Метод:** `GET`  
**Путь:** `/profile`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (200 OK):**
```json
{
    "id": 42,
    "login": "kostenko",
    "role": "CLIENT",
    "createdAt": "2026-05-07T19:24:32.923808",
    "isApproved": true,
    "clientType": "INDIVIDUAL",
    "email": "Graciela_Strosin15@hotmail.com",
    "phone": "+71337133712",
    "details": {
        "firstName": "Костенко",
        "lastName": "Константин",
        "midName": null,
        "birthDate": "1967-12-06"
    }
}
```

### 3.3. Измнение данных пользователя
**Метод:** `PATCH`  
**Путь:** `/profile`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
    "firstName": "Кирилл",
    "midName": "Дмитриевич",
    "email": "xxxromza@gmail.com"
}
```
**Успешный ответ (200 OK):**
```json
{
    "id": 10,
    "login": "test_user",
    "role": "CLIENT",
    "createdAt": "2026-05-06T22:51:34.10047",
    "isApproved": true,
    "clientType": "INDIVIDUAL",
    "email": "xxxromza@gmail.com",
    "phone": "+79991234567",
    "details": {
        "firstName": "Кирилл",
        "lastName": "Петров",
        "midName": "Дмитриевич",
        "birthDate": "2006-07-09"
    }
}
```

## 4. Корзина (Cart)

### 4.1. Получить корзину
**Метод:** `GET`  
**Путь:** `/cart`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (200 OK):**
```json
{
    "items": [
        {
            "variantId": 25,
            "brand": "Maison Margiela",
            "title": "Кроссовки Replica",
            "quantity": 1,
            "appliedPrice": 68000.00,
            "subtotal": 68000.00,
            "availableStock": 5,
            "priceType": "RETAIL",
            "imageUrl": null
        },
        {
            "variantId": 2,
            "brand": "Gucci",
            "title": "Бомбер GG Marmont",
            "quantity": 4,
            "appliedPrice": 140000.00,
            "subtotal": 560000.00,
            "availableStock": 3,
            "priceType": "WHOLESALE",
            "imageUrl": null
        },
        {
            "variantId": 1,
            "brand": "Gucci",
            "title": "Бомбер GG Marmont",
            "quantity": 4,
            "appliedPrice": 140000.00,
            "subtotal": 560000.00,
            "availableStock": 6,
            "priceType": "WHOLESALE",
            "imageUrl": "https://lux-cdn.example.com/gucci_bomber_blk_main.jpg"
        }
    ],
    "total_price": 1188000.00,
    "discount_applied": true,
    "can_checkout": false
}
```

### 4.2. Добавить товар в корзину
**Метод:** `POST`  
**Путь:** `/cart`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
    "variantId": {{variantId}},
    "quantity": {{quantity}}
}
```

**Успешный ответ (200 OK):**
```json
{
    "variantId": 2,
    "brand": "Gucci",
    "title": "Бомбер GG Marmont",
    "quantity": 4,
    "appliedPrice": 140000.00,
    "subtotal": 560000.00,
    "availableStock": 3,
    "priceType": "WHOLESALE",
    "imageUrl": null
}
```

### 4.3. Удалить товар из корзины
**Метод:** `DELETE`  
**Путь:** `/cart/{variantId}`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (204 No Content)**
**Тело ответа**: Отсутствует

### 4.4. Очистить корзину
**Метод:** `DELETE`  
**Путь:** `/cart`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (204 No Content)**
**Тело ответа**: Отсутствует

## 5. Заказы (Orders)

### 5.1. Создать заказ из корзины
**Метод:** `POST`  
**Путь:** `/orders`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
  "warehouseId": 1,
  "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
  "payment": "CARD",
  "comment": "Срочная доставка"
}
```

**Успешный ответ (201 Created):**
```json
{
    "id": 9,
    "userId": 8,
    "warehouseId": 2,
    "totalPrice": 395000.00,
    "address": "г. Краснодар Витаминокомбинат 101 п. 2",
    "paymentMethod": "SBP",
    "status": "NEW",
    "date": "2026-05-07T20:07:09.946603482",
    "items": [
        {
            "productId": 1,
            "variantId": 1,
            "brand": "Gucci",
            "title": "Бомбер GG Marmont",
            "sku": "GUC-BMB-BLK-M",
            "size": "M",
            "color": "Черный",
            "mainImageUrl": "https://lux-cdn.example.com/gucci_bomber_blk_thumb.jpg",
            "quantity": 1,
            "appliedPrice": 185000.00,
            "subtotal": 185000.00,
            "priceType": "RETAIL"
        },
        {
            "productId": 5,
            "variantId": 15,
            "brand": "Gucci",
            "title": "Костюм из шерсти Super 120",
            "sku": "GUC-SUT-NVY-50",
            "size": "50",
            "color": "Темно-синий",
            "mainImageUrl": null,
            "quantity": 1,
            "appliedPrice": 210000.00,
            "subtotal": 210000.00,
            "priceType": "RETAIL"
        }
    ],
    "statusHistory": [
        {
            "orderId": 9,
            "status": "NEW",
            "changedAt": "2026-05-07T20:07:09.949302167",
            "changedByName": "system",
            "comment": "Заказ создан"
        }
    ]
}
```

**Недостаточно товаров (422 Unprocessable Entity)**
```json
{
    "error": "NotEnoughItems",
    "errors": {
        "1": "Бомбер GG Marmont (Черный M): Недостаточно товара. Доступно: 2",
        "15": "Костюм из шерсти Super 120 (Темно-синий 50): Недостаточно товара. Доступно: 1"
    }
}
```
### 5.2. Создать заказ одного товара
**Метод:** `POST`  
**Путь:** `/orders/single`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
    "quantity": 3,
    "variantId": 4,
    "warehouseId": 2,
    "address": "г. Краснодар Витаминокомбинат 101 п. 2",
    "payment": "SBP",
    "comment": "ПОБЫСТРЕЕ"
}
```

**Успешный ответ (201 Created):**
```json
{
    "id": 10,
    "userId": 8,
    "warehouseId": 2,
    "totalPrice": 216000.00,
    "address": "г. Краснодар Витаминокомбинат 101 п. 2",
    "paymentMethod": "SBP",
    "status": "NEW",
    "date": "2026-05-07T20:07:51.01555857",
    "items": [
        {
            "productId": 2,
            "variantId": 4,
            "brand": "Prada",
            "title": "Рубашка из поплина",
            "sku": "PRA-SHT-WHT-39",
            "size": "39",
            "color": "Белый",
            "mainImageUrl": "https://lux-cdn.example.com/prada_shirt_wht_thumb.jpg",
            "quantity": 3,
            "appliedPrice": 72000.00,
            "subtotal": 216000.00,
            "priceType": "RETAIL"
        }
    ],
    "statusHistory": [
        {
            "orderId": 10,
            "status": "NEW",
            "changedAt": "2026-05-07T20:07:51.017698609",
            "changedByName": "system",
            "comment": "Заказ создан"
        }
    ]
}
```

**Недостаточно товаров (422 Unprocessable Entity)**
```json
{
    "error": "NotEnoughItems",
    "errors": {
        "1": "Бомбер GG Marmont (Черный M): Недостаточно товара. Доступно: 2",
        "15": "Костюм из шерсти Super 120 (Темно-синий 50): Недостаточно товара. Доступно: 1"
    }
}
```
**Склад не существует (404 Not Found)**
```json
{
    "error": "NotFound",
    "description": "Склад не найден"
}
```

### 5.3. Список заказов пользователя
**Метод:** `GET`  
**Путь:** `/orders`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Параметры (Query):**
| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **sort** | `string` | Сортировка | `?sort=date,asc` |
| **page** | `int` | Страница | `?page=0` |
| **size** | `int` | Размер | `?size=10` |
| **verbose** | `boolean` | Размер | `?verbose=0` |

**Успешный ответ (200 OK) Verbose = 0:**
```json
[
    {
        "id": 4,
        "userId": 8,
        "warehouseId": 1,
        "totalPrice": 96000.00,
        "address": "г. Казань, ул. Баумана, д. 10",
        "paymentMethod": "CASH",
        "status": "PROCESSING",
        "date": "2026-05-04T19:16:16.827122",
        "items": [
            {
                "productId": 7,
                "variantId": 19,
                "brand": "Gucci",
                "title": "Ремень GG Marmont 4 см",
                "sku": "GUC-BLT-BLK-85",
                "size": "85",
                "color": "Черный",
                "mainImageUrl": "https://lux-cdn.example.com/gucci_belt_blk_main.jpg",
                "quantity": 2,
                "appliedPrice": 48000.00,
                "subtotal": 96000.00,
                "priceType": "RETAIL"
            }
        ]
    },
    {
        "id": 9,
        "userId": 8,
        "warehouseId": 2,
        "totalPrice": 395000.00,
        "address": "г. Краснодар Витаминокомбинат 101 п. 2",
        "paymentMethod": "SBP",
        "status": "NEW",
        "date": "2026-05-07T20:07:09.946603",
        "items": [
            {
                "productId": 1,
                "variantId": 1,
                "brand": "Gucci",
                "title": "Бомбер GG Marmont",
                "sku": "GUC-BMB-BLK-M",
                "size": "M",
                "color": "Черный",
                "mainImageUrl": "https://lux-cdn.example.com/gucci_bomber_blk_thumb.jpg",
                "quantity": 1,
                "appliedPrice": 185000.00,
                "subtotal": 185000.00,
                "priceType": "RETAIL"
            },
            {
                "productId": 5,
                "variantId": 15,
                "brand": "Gucci",
                "title": "Костюм из шерсти Super 120",
                "sku": "GUC-SUT-NVY-50",
                "size": "50",
                "color": "Темно-синий",
                "mainImageUrl": null,
                "quantity": 1,
                "appliedPrice": 210000.00,
                "subtotal": 210000.00,
                "priceType": "RETAIL"
            }
        ]
    },
    {
        "id": 10,
        "userId": 8,
        "warehouseId": 2,
        "totalPrice": 216000.00,
        "address": "г. Краснодар Витаминокомбинат 101 п. 2",
        "paymentMethod": "SBP",
        "status": "NEW",
        "date": "2026-05-07T20:07:51.015559",
        "items": [
            {
                "productId": 2,
                "variantId": 4,
                "brand": "Prada",
                "title": "Рубашка из поплина",
                "sku": "PRA-SHT-WHT-39",
                "size": "39",
                "color": "Белый",
                "mainImageUrl": "https://lux-cdn.example.com/prada_shirt_wht_thumb.jpg",
                "quantity": 3,
                "appliedPrice": 72000.00,
                "subtotal": 216000.00,
                "priceType": "RETAIL"
            }
        ]
    }
]
```

### 5.4 Получить информацию о заказе
**Метод:** `GET`  
**Путь:** `/orders/{id}`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (200 OK):**
```json
{
    "id": 10,
    "userId": 8,
    "warehouseId": 2,
    "totalPrice": 216000.00,
    "address": "г. Краснодар Витаминокомбинат 101 п. 2",
    "paymentMethod": "SBP",
    "status": "NEW",
    "date": "2026-05-07T20:07:51.015559",
    "items": [
        {
            "productId": 2,
            "variantId": 4,
            "brand": "Prada",
            "title": "Рубашка из поплина",
            "sku": "PRA-SHT-WHT-39",
            "size": "39",
            "color": "Белый",
            "mainImageUrl": "https://lux-cdn.example.com/prada_shirt_wht_thumb.jpg",
            "quantity": 3,
            "appliedPrice": 72000.00,
            "subtotal": 216000.00,
            "priceType": "RETAIL"
        }
    ],
    "statusHistory": [
        {
            "orderId": 10,
            "status": "NEW",
            "changedAt": "2026-05-07T20:07:51.017699",
            "changedByName": "system",
            "comment": "Заказ создан"
        }
    ]
}
```

**Нет прав на просмотр (403 Forbidden)**
Заказ принадлежит другому пользователю

```json
{
    "error": "Forbidden",
    "description": "Нет прав на просмотр этого заказа"
}
```

## 6. Утилитарные эндпоинты
Эндпоинты для Frontend

### 6.1 Получение счётчиков категорий для хедера
**Метод:** `GET`  
**Путь:** `/header`  
**Доступ:** Всем 

**Тело запроса**

**Успешный ответ (200 ОК):**: 
```json
{
    "saleCount": 4,
    "manCount": 3,
    "womenCount": 3,
    "brandCount": 4
}
```
## 7. Администрирование (Admin/Manager)
**ОТЛОЖЕНО**

### 7.1. Обновить статус заказа
**Метод:** `PATCH`  
**Путь:** `/admin/orders/{id}/status`  
**Доступ:** `MANAGER`, `ADMIN`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
  "status": "ASSEMBLING",
  "comment": "Начата сборка"
}
```

**Успешный ответ (200 OK):**
```json
{
  "orderId": 1025,
  "status": "ASSEMBLING",
  "changedAt": "2026-03-21T18:45:00",
  "changedByName": "madin_manager",
  "comment": "Начата сборка"
}
```

### 7.2. Обновить остатки
**Метод:** `PUT`  
**Путь:** `/admin/stock`  
**Доступ:** `MANAGER`, `ADMIN`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
  "variantId": 1,
  "warehouseId": 1,
  "quantity": 50
}
```

**Успешный ответ (200 OK):**
```json
{
  "message": "Остатки успешно обновлены"
}
```

### 7.3. Создать товар
**Метод:** `POST`  
**Путь:** `/admin/products`  
**Доступ:** `ADMIN`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
  "title": "Худи 'Over-size' Базовое",
  "description": "Плотный хлопок 100%",
  "priceRetail": 4500.00,
  "priceWholesale": 3800.00,
  "wholesaleThreshold": 10,
  "categoryId": 5
}
```

**Успешный ответ (201 Created):**
```json
{
  "id": 23,
  "title": "Худи 'Over-size' Базовое",
  "description": "Плотный хлопок 100%",
  "priceRetail": 4500.00,
  "priceWholesale": 3800.00,
  "wholesaleThreshold": 10,
  "categoryId": 5,
  "variants": []
}
```

### 7.4. Создать категорию
**Метод:** `POST`  
**Путь:** `/admin/categories`  
**Доступ:** `ADMIN`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
  "name": "Аксессуары"
}
```

**Успешный ответ (201 Created):**
```json
{
  "id": 12345,
  "name": "Аксессуары"
}
```

### 7.5. Создать склад
**Метод:** `POST`  
**Путь:** `/admin/warehouses`  
**Доступ:** `ADMIN`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
  "address": "г. Краснодар ул. Красная 140 п.3"
}
```

**Успешный ответ (201 Created):**
```json
{
  "id": 1337,
  "address": "г. Краснодар ул. Красная 140 п.3"
}
```

### 7.6. Получить список складов
**Метод:** `GET`  
**Путь:** `/admin/warehouses`  
**Доступ:** `ADMIN`, `MANAGER`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (200 OK):**
```json
[
  {
    "id": 1,
    "address": "г. Москва ул. Складская д. 3"
  }
]
```

### 7.7. Список пользователей
**Метод:** `GET`  
**Путь:** `/admin/users`  
**Доступ:** `ADMIN`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Параметры (Query):**
| Параметр | Тип | Описание |
| :--- | :--- | :--- |
| **approved** | `boolean` | Статус одобрения |
| **sort** | `string` | Сортировка |
| **page** | `int` | Страница |
| **size** | `int` | Размер |

**Успешный ответ (200 OK):**
```json
[
  {
    "id": 1,
    "login": "pavalapi",
    "role": "CLIENT",
    "clientType": "LEGAL",
    "createdAt": "2026-03-21T18:45:00",
    "isApproved": false
  }
]
```

### 7.8. Изменить пользователя
**Метод:** `PATCH`  
**Путь:** `/admin/users/{id}`  
**Доступ:** `ADMIN`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
  "isApproved": true,
  "role": "MANAGER"
}
```

**Успешный ответ (200 OK):**
```json
{
  "id": 1,
  "login": "pavalapi",
  "role": "MANAGER",
  "createdAt": "2026-03-21T18:45:00",
  "isApproved": true,
  "clientType": "LEGAL"
}
```

### 7.9. Изменить товар
**Метод:** `PATCH`  
**Путь:** `/admin/products/{id}`  
**Доступ:** `ADMIN`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
  "title": "Худи 'Over-size' Премиальное",
  "priceRetail": 4600.00
}
```

**Успешный ответ (200 OK):**
```json
{
  "id": 23,
  "title": "Худи 'Over-size' Премиальное",
  "priceRetail": 4600.00,
  "priceWholesale": 3800.00,
  "categoryId": 5
}
```

### 7.10. Создать вариант товара
**Метод:** `POST`  
**Путь:** `/admin/products/{productId}/variants`  
**Доступ:** `ADMIN`, `MANAGER`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
  "size": "XL",
  "color": "Черный",
  "sku": "HD-BLK-XL"
}
```

**Успешный ответ (201 Created):**
```json
{
  "id": 101,
  "productId": 23,
  "sku": "HD-BLK-XL",
  "size": "XL",
  "color": "Черный",
  "isActive": true
}
```

### 7.11. Изменить вариант товара
**Метод:** `PATCH`  
**Путь:** `/admin/products/{productId}/variants/{variantId}`  
**Доступ:** `ADMIN`, `MANAGER`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
  "sku": "HD-BLK-XL-NEW"
}
```

**Успешный ответ (200 OK):**
```json
{
  "id": 101,
  "productId": 23,
  "sku": "HD-BLK-XL-NEW",
  "size": "XL",
  "color": "Черный",
  "isActive": true
}
```

### 7.12. Загрузить фото варианта
**Метод:** `POST`  
**Путь:** `/admin/products/{productId}/variants/{variantId}/images`  
**Доступ:** `ADMIN`, `MANAGER`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса (Multipart Form Data):**
| Параметр | Тип | Описание |
| :--- | :--- | :--- |
| **file** | `File` | Файл изображения (png, jpg, webp) |
| **type** | `string` | `MAIN`, `GALLERY`, `THUMBNAIL` |

**Успешный ответ (201 Created):**
```json
{
  "id": 501,
  "url": "https://res.cloudinary.com/xromza/image/upload/v1/products/hoodie_blk_new.jpg",
  "type": "MAIN",
  "sortOrder": 1,
  "createdAt": "2026-04-14T22:30:00"
}
```

### 7.13. Удалить фото варианта
**Метод:** `DELETE`  
**Путь:** `/admin/products/{productId}/variants/{variantId}/images/{imageId}`  
**Доступ:** `ADMIN`, `MANAGER`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (204 No Content)**

### 7.14. Изменить скидку по категории
**Метод:** `PATCH`  
**Путь:** `/admin/discounts/{categoryId}`  
**Доступ:** `ADMIN`, `MANAGER`  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Тело запроса:**
```json
{
  "discount": 0.1
}
```

**Успешный ответ (200 OK):**
```json
{
  "categoryId": 2,
  "discount": 0.1
}
```

