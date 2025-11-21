import Link from "next/link";

export default function Header(){
    return(
        <div className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between">
                <div className="myname">
                    <Link href="/">ShinJw</Link> 
                </div>
            </nav>
        </div>
    )
}