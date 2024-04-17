import { FaCog, FaGift, FaHome, FaRegEye, FaRegEyeSlash, FaRegMoneyBillAlt } from "react-icons/fa";

const Menu = () => {
    return (
        <footer className="fixed bottom-4 w-full flex justify-center">
            <div className="py-4 px-3 w-[80%] shadow-outline-glow rounded-3xl flex flex-row justify-evenly">
                <FaHome size={40} />
                <FaRegMoneyBillAlt size={40} />
            </div>
        </footer>)
}

export default Menu;