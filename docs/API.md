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

**Успешный ответ (200 OK):**
```json
{
  "content": [
    {
      "id": 42,
      "title": "Худи 'Over-size' Базовое",
      "priceRetail": 4500.00,
      "priceWholesale": 3800.00,
      "mainImageUrl": "https://res.cloudinary.com/hekr/image/upload/v1/products/hoodie_blk_main.jpg",
      "categoryId": 5,
      "categoryName": "Одежда",
      "isActive": true
    }
  ],
  "totalElements": 150,
  "totalPages": 15,
  "currentPage": 0,
  "isLast": false
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

**Успешный ответ (200 OK):**
```json
{
  "content": [
    {
      "id": 42,
      "title": "Худи 'Over-size' Базовое",
      "priceRetail": 4500.00,
      "priceWholesale": 3800.00,
      "mainImageUrl": "https://res.cloudinary.com/xromza/image/upload/v1/products/hoodie_black.jpg",
      "categoryId": 5,
      "categoryName": "Одежда",
      "isActive": true
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "currentPage": 0,
  "isLast": true
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
  "id": 42,
  "title": "Худи 'Over-size' Базовое",
  "description": "Плотный хлопок, свободный крой.",
  "categoryId": 5,
  "categoryName": "Одежда",
  "isActive": true,
  "priceWholesale": 3800.00,
  "priceRetail": 4500.00,
  "wholesaleThreshold": 10,
  "mainImageUrl": "https://res.cloudinary.com/hekr/image/upload/v1/products/hoodie_blk_main.jpg",
  "variants": [
    {
      "id": 101,
      "productId": 42,
      "sku": "HD-BLK-XL",
      "size": "XL",
      "color": "Черный",
      "isActive": true,
      "images": [
        {
          "id": 501,
          "url": "https://res.cloudinary.com/hekr/image/upload/v1/products/hoodie_blk_front.jpg",
          "type": "MAIN",
          "sortOrder": 1,
          "createdAt": "2026-04-13T14:00:00"
        }
      ],
      "stock": [
        {
          "variantId": 101,
          "warehouseId": 1,
          "address": "г. Москва ул. Складская д. 3",
          "quantity": 15
        }
      ]
    }
  ]
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

**Тело запроса:**
```json
{
  "login": "kirill_petrov",
  "password": "securepass123",
  "role": "CLIENT",
  "clientType": "INDIVIDUAL",
  "phone": "+79991234567",
  "email": "petrov.k@example.com",
  "firstName": "Кирилл",
  "lastName": "Петров"
}
```

**Успешный ответ (201 Created):**
```json
{
  "login": "kirill_petrov",
  "description": "Успешная регистрация"
}
```

### 2.3. Регистрация юридического лица (LEGAL)
**Метод:** `POST`  
**Путь:** `/auth/registration`  
**Доступ:** Всем  

**Тело запроса:**
```json
{
  "login": "xromzas_software_llc",
  "password": "securepass",
  "role": "CLIENT",
  "clientType": "LEGAL",
  "phone": "+74951234567",
  "email": "corp@xromza.tech"
}
```

**Успешный ответ (201 Created):**
```json
{
  "login": "xromzas_software_llc",
  "description": "Успешная регистрация"
}
```

### 2.4. Обновление токена (Refresh)
**Метод:** `POST`  
**Путь:** `/auth/refresh`  
**Доступ:** Всем  
**Cookie:** refreshToken

**Успешный ответ (201 Created):**
```json
{
  "token": "new_access_token",
  "refreshToken": "new_refresh_token",
  "type": "Bearer"
}
```

## 3. Профиль (Profile)

### 3.1. Получить данные профиля
**Метод:** `GET`  
**Путь:** `/profile`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (200 OK):**
```json
{
  "id": 1,
  "login": "kirill_petrov",
  "role": "CLIENT",
  "clientType": "INDIVIDUAL",
  "createdAt": "2026-03-15T12:00:00",
  "isApproved": true,
  "firstName": "Кирилл",
  "lastName": "Петров"
}
```

### 3.2. Данные физического лица
**Метод:** `GET`  
**Путь:** `/profile/individual-details`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (200 OK):**
```json
{
  "firstName": "Кирилл",
  "lastName": "Петров",
  "midName": "Дмитриевич",
  "birthDate": "2000-01-01"
}
```

### 3.3. Данные юридического лица
**Метод:** `GET`  
**Путь:** `/profile/legal-details`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (200 OK):**
```json
{
  "companyName": "ООО Программное Обеспечение",
  "inn": "1337069420",
  "kpp": "177301001",
  "ogrn": "1027710132195",
  "legalAddress": "г. Москва, ул. Заводская, 10"
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
      "variantId": 101,
      "title": "Худи 'Over-size' Базовое",
      "quantity": 12,
      "appliedPrice": 3800.00,
      "subtotal": 45600.00,
      "availableStock": 50,
      "priceType": "WHOLESALE",
      "imageUrl": "https://res.cloudinary.com/xromza/image/upload/v1/products/hoodie_blk_thumb.jpg"
    }
  ],
  "total_price": 45600.00,
  "discount_applied": false,
  "can_checkout": true
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
  "variantId": 101,
  "quantity": 5
}
```

**Успешный ответ (200 OK):**
```json
{
  "variantId": 101,
  "currentQuantity": 5,
  "message": "Корзина обновлена"
}
```

### 4.3. Удалить товар из корзины
**Метод:** `DELETE`  
**Путь:** `/cart/{variantId}`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (200 OK):**
```json
{
  "variantId": 101,
  "title": "Худи 'Over-size' Базовое",
  "message": "Позиция успешно удалена из корзины"
}
```

### 4.4. Очистить корзину
**Метод:** `DELETE`  
**Путь:** `/cart`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (200 OK):**
```json
{
  "count": 2,
  "message": "Товары успешно удалены из корзины"
}
```

## 5. Оформление заказа (Checkout)

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
  "id": 1025,
  "userId": 1,
  "warehouseId": 1,
  "total_price": 41800.00,
  "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
  "payment_method": "CARD",
  "status": "NEW",
  "date": "2026-04-14T12:30:00"
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
  "variantId": 101,
  "quantity": 5,
  "warehouseId": 1,
  "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
  "payment": "CARD",
  "comment": "Срочно"
}
```

**Успешный ответ (201 Created):**
```json
{
  "id": 1026,
  "userId": 1,
  "warehouseId": 1,
  "total_price": 19000.00,
  "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
  "payment_method": "CARD",
  "status": "NEW",
  "date": "2026-04-14T12:40:00"
}
```

## 6. История заказов (Order History)

### 6.1. Список заказов пользователя
**Метод:** `GET`  
**Путь:** `/order_history`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Параметры (Query):**
| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **sort** | `string` | Сортировка | `?sort=date,asc` |
| **page** | `int` | Страница | `?page=0` |
| **size** | `int` | Размер | `?size=10` |

**Успешный ответ (200 OK):**
```json
[
  {
    "id": 1024,
    "userId": 1,
    "warehouseId": 1,
    "total_price": 2450.00,
    "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
    "payment_method": "CASH",
    "status": "COMPLETED",
    "date": "2026-03-20T15:30:00"
  }
]
```

### 6.2. Получить информацию о заказе
**Метод:** `GET`  
**Путь:** `/order_history/{id}`  
**Доступ:** Авторизованный пользователь  
**Заголовки:** `Authorization: Bearer <your_token_here>`

**Успешный ответ (200 OK):**
```json
{
  "id": 1024,
  "userId": 1,
  "warehouseId": 1,
  "total_price": 41800.00,
  "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
  "payment_method": "INVOICE",
  "status": "COMPLETED",
  "date": "2026-03-20T15:30:00",
  "items": [
    {
      "variantId": 101,
      "title": "Худи 'Over-size' Базовое",
      "quantity": 12,
      "appliedPrice": 3800.00,
      "subtotal": 45600.00,
      "availableStock": 50,
      "priceType": "WHOLESALE",
      "imageUrl": "https://res.cloudinary.com/xromza/image/upload/v1/products/hoodie_blk_thumb.jpg"
    }
  ],
  "status_history": [
    {
      "orderId": 1025,
      "status": "ASSEMBLING",
      "changedAt": "2026-03-21T18:45:00",
      "changedByName": "madin_manager",
      "comment": "Начата сборка"
    }
  ],
  "price_type": "WHOLESALE"
}
```

## 7. Администрирование (Admin/Manager)

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

