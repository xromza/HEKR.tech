"use client"
import { useState } from "react";
import useMobile from "@/hooks/useMobile";
import HeaderClientMobile from "./HeaderClientMobile";
import { HeaderItem } from "@/types/HeaderItem";
import HeaderClientBig from "./HeaderClientBig";

export default function HeaderClient({ items }: { items: HeaderItem[] }) {
    const isMobile = useMobile(768);
    const [isLoginVisible, setIsLoginVisible] = useState(false);
    return (
        (isMobile 
            ? <HeaderClientMobile isLoginVisible={isLoginVisible} setIsLoginVisible={setIsLoginVisible} items={items} /> 
            : <HeaderClientBig isLoginVisible={isLoginVisible} setIsLoginVisible={setIsLoginVisible} items={items} />)
    )
}