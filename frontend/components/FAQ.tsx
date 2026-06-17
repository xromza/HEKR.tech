"use client";
import FAQItem from "./FAQItem";

interface faqitem {
    text: string,
    title: string
}

export default function FAQ() {

let items: faqitem[] = [
    {
        title: "Как получить оптовую цену?",
        text: "Оптовая цена активируется автоматически при заказе от определённого единиц одного артикула. Количество указанывается на странице товара"
    },
    {
        title: "Что делать при обнаружении брака?",
        text: "Мы обменяем товар или вернем деньги в течение 14 дней. Расходы по пересылке брака берем на себя."
    },
    {
        title: "Документы для юрлиц (ООП/ИП)",
        text: "Предоставляем полный пакет документов: счет, накладную ТОРГ-12 и договор. Работаем через ЭДО."
    },
    {
        title: "Можно ли отменить заказ?",
        text: "Да, если доставка задерживается более чем на 3 дня от обещанного срока, вы можете оформить полный возврат."
    },
    {
        title: "Минимальный заказ для опта",
        text: "Минимальной суммы нет. Стоимость для каждого товара выбирается индивидуально."
    }
]

    return (
        <article className='flex flex-col gap-2 bg-[#FFFFFF] mx-[5%] my-[12rem] h-auto min-h-[32rem]'>
            <h2 className='uppercase text-5xl font-semibold mb-[3rem]'>Часто задаваемые вопросы</h2>
            <div className='flex flex-col justify-between h-[95%]'>
                {items.map((item, idx) => <FAQItem
                    key={idx}
                    text={item.text}
                    title={item.title}
                />)}
            </div>
        </article>
    )
}