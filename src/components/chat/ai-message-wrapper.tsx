const AIMessageWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex -mt-3">
            <div className="w-[42px]" />
            <div className="flex-1">
                <div className="max-w-[calc(100vw-56px-50px)]">{children}</div>
            </div>
        </div>
    )
}

export default AIMessageWrapper;