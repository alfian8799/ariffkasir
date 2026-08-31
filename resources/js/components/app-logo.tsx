export default function AppLogo() {
    return (
        <div className="flex items-center gap-3 overflow-hidden">
            <div className="grid flex-1 text-left leading-tight">
                {/* Tampilan Normal (Sidebar Terbuka) */}
                <span className="font-extrabold tracking-wide text-2xl group-data-[collapsible=icon]:hidden">
                    <span className="text-black dark:text-white">Ariff</span>
                    <span className="text-red-600 italic ml-1">Kasir</span>
                </span>

                {/* Tampilan Saat Sidebar Menyempit (Collapsed) */}
                <span className="hidden font-extrabold tracking-wide text-xl group-data-[collapsible=icon]:inline-block">
                    <span className="text-black dark:text-white">A</span>
                    <span className="text-red-600 italic">K</span>
                </span>
            </div>
        </div>
    );
}