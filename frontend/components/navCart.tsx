export default function NavCart(){
    return(
        <div className="flex flex-col w-[10%] mr-[5%] gap-y-5">
          <h1 className="text-4xl font-black uppercase">Корзина</h1>
          <nav className="flex-1">
            <ul className="uppercase underline underline-offset-8 text-nowrap h-full flex flex-col justify-start">
              <li>Главная</li>
              <li className="mt-[8px]">Личный кабинет</li>
            </ul>
          </nav>
        </div>
    )
}