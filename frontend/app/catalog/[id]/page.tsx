export default async function CardPage({
    params,
}:
    { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    return (
        <div className="w-full flex justify-center items-center">
            <div>Страница карточки {id}</div>
        </div>
    )
}