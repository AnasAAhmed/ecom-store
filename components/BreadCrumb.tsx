'use client'
import SmartLink from "@/components/SmartLink";
import { usePathname } from "next/navigation";


const Breadcrumb = () => {
    const pathname = usePathname();

    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs = ['', ...segments.slice(0, -1)]; // all but last
    const lastSegment = segments[segments.length - 1]; // last part like "something"

    return (
        <nav className="px-4 pt-8 text-[10px] sm:text-[15px] font-medium">
            <div className="max-w-screen-lg mx-lauto">
                <div className="flex flex-s  items-center space-x-2">
                    {breadcrumbs.map((segment, index) => {
                        const path = '/' + breadcrumbs.slice(1, index + 1).join('/');
                        const label = segment === '' ? 'Home' : decodeURIComponent(segment);

                        return (
                            <span key={index} className="flex items-center space-x-1">
                                {index > 0 && <span className="mx-1 text-gray-400">/</span>}
                                {index !== 1 ?
                                    <SmartLink href={path} className="text-gray-600 capitalize">
                                        {label}
                                    </SmartLink> : <span className="text-gray-600 capitalize">
                                        {label}
                                    </span>}
                            </span>
                        );
                    })}

                    {/* Last segment with query string */}
                    {lastSegment && (
                        <span className="flex max-w-d truncate text-ellipsis items-center space-x-1">
                            {segments.length > 0 && <span>/</span>}
                            <SmartLink
                                href={`${pathname}`}
                                className="text-black font-medium capitalize"
                            >
                                {decodeURIComponent(lastSegment)}
                            </SmartLink>
                        </span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Breadcrumb;
