import Link from "next/link";

export default function Home() {
  return (
    <>
        <nav className="
                flex flex-col justify-between items-center
                md:pt-24 md:w-72 md:self-center
        ">
            <h1>AI Thing</h1>
        </nav>
        <main className="h-full w-full grow flex justify-center md:pt-10">
            <div className="justify-self-center flex flex-col">
                <h3>Choose A Game</h3>
                <div className="pt-4 flex justify-center items-center">
                    <Card/>
                </div>
            </div>
        </main>
        <footer className="text-center">
            <h4>Checkout Our GitHub!</h4>
        </footer>
    </>
  )
}

function Card() {
    return (
        <Link href={"/pong"}>
            <div 
                className="
                    shadow shadow-r1-brown hover:shadow-md hover:shadow-r1-brown 
                    rounded-lg flex flex-col items-center justify-around w-32 h-52 px-3 pb-3 pt-1"
            >
                <h3>Pong</h3>
                <div 
                    className="
                        bg-[url('/pong.gif')] bg-contain w-full h-5/6 rounded-lg
                        hover:bg-cover hover:blur-sm hover:bg-center"
                >
                </div>
            </div>
        </Link>
    )
}
