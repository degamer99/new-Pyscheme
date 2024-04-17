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
   useEffect(() => {
    onAuthStateChanged( auth, async (user) => {
        if (user) {
            await getDoc(doc(firestore, "users", user.uid))
            .then((file) => {

            })

        }else{
            console.log("No User Found")
        }
    })
   }, [])
    return (<>
        <header className={styles.head}>
            <div>
                {/* { currentUser1 ? <p>{currentuser1}</p>
                : <p>Nothing</p>
                } */}
                <h1>Welcome </h1>
                <p> My Balance</p>
                <p>#2000</p>
                <p>Total Earning</p>
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
                <p className='text-right '><FlutterWaveButton {...fwConfig} /></p>

                {/* <PaystackHookExample email={email} /> */}
            </div>
            <div className={styles.middle}>
                <h3> Your referals (0)</h3>
                {/* <h3> Your referals ({referals}) </h3> */}
                <ShareButton />
            </div>
            <section className={styles.referrals}>
                <article>
                    <div>
                        <h4>Name</h4>
                        <p>#500</p>
                    </div>
                    <div>
                        <h4>Total reward</h4>
                        <p>#500</p>
                    </div>
                </article>
                <article>
                    <div>
                        <h4>Name</h4>
                        <p>#500</p>
                    </div>
                    <div>
                        <h4>Total reward</h4>
                        <p>#500</p>
                    </div>
                </article>
                <article>
                    <div>
                        <h4>Name</h4>
                        <p>#500</p>
                    </div>
                    <div>
                        <h4>Total reward</h4>
                        <p>#500</p>
                    </div>
                </article>
            </section>
        </main>
        <Menu />
    </>)
}
export default Home;