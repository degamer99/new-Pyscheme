import styles from '../styles/home.module.sass'
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { FaCog, FaGift, FaHome, FaRegEye, FaRegEyeSlash, FaRegMoneyBillAlt } from "react-icons/fa";
import { VscSettingsGear, VscHome } from "react-icons/vsc";
import { MdShare, MdOutlineDashboard } from "react-icons/md";
import { useRef, useState, useEffect, useContext } from 'react';
import Menu from "../components/menu"
import { useRouter } from 'next/router';
import ShareButton from "../components/share"
import { useUser, UserContext } from '@/components/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '@/components/firebase';
import { doc, getDoc } from 'firebase/firestore';
import CopyCodeToClipboard from '@/components/copy';

const config = {
    public_key: 'FLWPUBK_TEST-992f6012c9ee2921a857efbfd44369d2-X',
    tx_ref: Date.now(),
    amount: 100,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
        email: 'user@gmail.com',
        phone_number: '07063964857',
        name: 'john doe',
    },
    customizations: {
        title: 'My store',
        description: 'Payment for items in cart',
        logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
};

const fwConfig = {
    ...config,
    text: 'Pay with Flutterwave!',
    callback: (response) => {
        console.log(response);
        closePaymentModal() // this will close the modal programmatically
    },
    onClose: () => { },
};

const Home = () => {
    const router = useRouter();
    const [data, setData] = useState()
    const [switchToRefer, setSwitchToRefer] = useState(true)
    // console.log("data outside useEffect",  data)

    const saveToLocalStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const checkLocalStorage = (key) => {
        const value = JSON.parse(localStorage.getItem(key));
        console.log("this is value", value)
        return value !== null; // Return true if value is present, false otherwise
    };
    useEffect(() => {
        if (!router.isReady) return;
        onAuthStateChanged(auth, async (user) => {
            console.log("data inside useEffect", data)
            if (user) {
                await getDoc(doc(firestore, "users", user.uid))
                    .then((file) => {
                        console.log("inside useEffect then", file.data())
                        setData(file.data())
                    })

            } else {
                console.log("No User Found");
                router.push("/")
            }
        })
    }, [router.isReady])
    
    return (<>
        <header className={styles.head}>
            <div>
                <p className=''>Welcome, {data ? data.name : "..."}</p>
                <h1> Total Earning : {data ? data.balance : "..."}</h1>
                <p className=''>Pending Balance : {data ? data.pendingBalance: "..."}</p>
            </div>
            <div>
                <span onClick={() => router.push("settings")}>
                    {/* <FaCog /> */}
                    <VscSettingsGear />
                </span>
            </div>
        </header>
        <main className={styles.main}>
            <div className={styles.member}>
                <h3>Become a Member</h3>
                <p>Enjoy cool benefits, cash prizes and rewards, perform tasks and activities, earn cash through your affiliate link when someone registers.</p>
                <p className='flex w-full justify-end' ><FlutterWaveButton className='bg-black text-white py-2 px-3 font-semibold rounded-md my-2 mr-0 relative' {...fwConfig} /></p>

                {/* <PaystackHookExample email={email} /> */}
            </div>
            
            <section className='w-full '>
                <ul className='flex justify-evenly my-8 mx-auto text-xl  font-bold text-gray-700' style={{ width: "min(350px, 90vw)", }}>
                    <li onClick={() => setSwitchToRefer(true)} className={ switchToRefer ? "referBorder text-gray-950" : ""}>Refers</li>
                    <li onClick={() => setSwitchToRefer(false)} className={ !switchToRefer ? "referBorder text-gray-950" : ""}>Tasks</li>
                </ul>
            </section>
            <div className={ switchToRefer ? "" : "hidden" }>
            <div className={styles.middle}>
                <h3 className='text-lg text-gray-900 font-bold'> Your referals {data && `(${data.refered.length})`}</h3>
                {/* <h3> Your referals ({referals}) </h3> */}
                <div className='flex items-center gap-2'>
                    <CopyCodeToClipboard code={data ? `${data.code}` : ""}  className="mr-2" />
                    <ShareButton code={data ? `${data.code}` : ""} />
                </div>
            </div>

                <section className={styles.referrals}>
                    
                    {data ? data.refered.map(({ name, uid }, index) => {
                        console.log("are u working", name)
                        return (<article key={index}>
                            <div>
                                <h4 className='font-bold text-lg text-gray-800'>Name</h4>
                                <p>Total reward</p>
                            </div>
                            <div>
                                <h4 className='font-bold text-lg text-gray-800'>{name}</h4>
                                <p>#400</p>
                            </div> 
                        </article>);
                    })
                        :
                        (() => {
                            return (<article>
                                <div>
                                    <h4></h4>
                                    <p></p>
                                </div>
                                <div>
                                    <h4></h4>
                                    <p></p>
                                </div>
                            </article>)
                        })()}
                </section>
            </div>
            <div className={ !switchToRefer ? "" : "hidden" }>
            <section>
                <p className='text-center text-lg text-gray-700 font-bold my-4'>Coming Soon... </p>
            </section>

            </div>
        </main>
        <Menu />
    </>)
}
export default Home;