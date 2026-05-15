import { getProduct } from "@/app/lib/Product";
import { ProductInterface } from "@/types/ProductInterface";
import { div } from "framer-motion/client";

export default async function CardPage({
    params,
}: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return <div className="w-full flex justify-center items-center">Товар не найден</div>
    }

    return (
        <div className="w-full items-center">
            <div>
                <h1>{product.title}</h1>
                <p>Бренд: {product.brand}</p>
                <p>Розничная цена: {product.priceWholesale}</p>
                <p>Оптовая цена: {product.priceRetail}</p>
                <img src={product.mainImageUrl} alt={product.title} className="w-full h-auto rounded-lg" />
            </div>
        </div>
    )

    /*const product: ProductInterface = {
        id: Number(id),
        brand: "SAINTS KELLY",
        title: "КУРТКА ДУТАЯ",
        description: "КОЖАНАЯ МОДНАЯ КУРТКА, КОТОРАЯ ХОРОШО ПОДОЙДЕТ С ШИРОКИМИ ДЖИНСАМИ, ЛЮБАЯ ПУСТЬ ПОДХОДИТ",
        categoryId: 5,
        categoryName: "Верхняя одежда",
        isActive: true,
        priceRetail: 19600,
        priceWholesale: 12500,
        wholesaleThreshold: 8,
        mainImageUrl: "https://res.cloudinary.com/dcc2qkmq7/image/upload/v1778696821/glasses_main_lcn7se.png",
        variants: [
            {
                id: 101,
                productId: Number(id),
                sku: "SAINTS-KELLY-52",
                size: "52",
                color: "Чёрный",
                weight: 1,
                isActive: true,
                stock: [
                    { variantId: 101, warehouseId: 1, address: "Склад Москва", quantity: 15 }
                ],
                images: [
                    { id: 1, url: "https://res.cloudinary.com/dcc2qkmq7/image/upload/v1778696821/glasses_main_lcn7se.png", type: "MAIN", sortOrder: 1, createdAt: ""}
                ]
            },
            {
                id: 102,
                productId: Number(id),
                sku: "SAINTS-KELLY-56",
                size: "56",
                color: "Чёрный",
                weight: 1,
                isActive: true,
                stock: [
                    { variantId: 102, warehouseId: 1, address: "Склад Краснодар", quantity: 0 }
                ],
                images: []
            }
        ]
    };
    */

    /*
    return (
        <div className="w-full flex justify-center items-center">
            <div>Страница карточки (скоро тут будет красота, в разработке) {id}</div>
        </div>
    )
    */
}