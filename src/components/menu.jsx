import { FaCog, FaGift, FaHome, FaRegEye, FaRegEyeSlash, FaRegMoneyBillAlt } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { BiWallet } from "react-icons/bi";

const Menu = () => {
    return (
        <footer className="fixed bottom-4 w-full flex justify-center">
            <div className="py-4 px-3 w-[80%] shadow-outline-glow rounded-3xl flex flex-row justify-evenly">
                <AiOutlineHome size={40} />
                <BiWallet size={40} />
            </div>
        </footer>)
}

export default Menu;