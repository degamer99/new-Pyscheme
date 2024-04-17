import Link from 'next/link'
import { FaSignal } from 'react-icons/fa'
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, collection, where, getDocs, query, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, firestore } from '@/components/firebase';
import { useRouter } from 'next/router';

const Signup = () => {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [userUid, setUserUid] = useState("");
    const { r } = router.query;
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        code: r,
        name: '',
        // Add more form fields as needed
    });
    useEffect(() => {
    if(!router.isReady) return;
        setFormData(prevState => ({ ...prevState, code: r }));

    }, [r, router.isReady])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setErrorMessage("Loading ...");
            const { user } = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Send email verification
            sendEmailVerification(user);
            // Store extra data in Firestore
            const userRef = doc(firestore, "users", user.uid);
            await setDoc(userRef,
                {
                    ...formData,
                    referralCode: `${user.uid.substring(0, 6)}`,
                    referedBy: formData.code,
                    refered: [],
                    numberOfRefered: 0,
                    date: Date.now(),
                    pendingBalance: 0,
                    balance: 0,
                    paid: false
                });
            //   

            await handleRefer(formData.code, formData.name, user.uid)
                .then(() => router.push("/home"));
            console.log("User signed up:", user);
        } catch (error) {
            handleAuthError(error);
            console.error("Error signing up:", error.message);
        }


        console.log(formData)
    }
    const handleAuthError = (error) => {
        switch (error.code) {
            case "auth/email-already-in-use":
                setErrorMessage(
                    "Email is already in use. Please choose another email."
                );
                break;
            case "auth/invalid-email":
                setErrorMessage("Invalid email address.");
                break;
            case "auth/weak-password":
                setErrorMessage(
                    "Password is too weak. Please choose a stronger password."
                );
                break;
            case "auth/invalid-credential":
            case "auth/user-not-found":
            case "auth/wrong-password":
                setErrorMessage("Invalid email or password.");
                break;
            default:
                setErrorMessage(
                    "An error occurred during authentication. Please try again later."
                );
                break;
        }
    };

    const handleRefer = async (code, name, uid) => {
        console.log(code, uid)
        const findCollectionByReferralCode = async (code) => {
            try {
                const q = query(collection(firestore, 'users'), where('referralCode', '==', code));
                const querySnapshot = await getDocs(q);

                const results = [];
                querySnapshot.forEach((doc) => {
                    results.push({ id: doc.id, data: doc.data() });
                });

                return results;
            } catch (error) {
                console.error('Error querying Firestore:', error);
                return [];
            }
        };
        findCollectionByReferralCode(code)
            .then((results) => {
                updateRef(results[0].id, uid, name, pendingBalance, 400);
                console.log('Query results:', results[0].id);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }
    const updateRef = async (userID, refID, name) => {
        await updateDoc(doc(firestore, "users", userID), {
            refered: arrayUnion({ uid: refID, name })
        }).then(() => console.log("ref updated"))
    }

    return (<>
        <header className="my-10 flex justify-center">
            <FaSignal size={40} />
            <h1 className="text-4xl font-bold">Pyscheme</h1>
        </header>
        <main>
            <form className='mx-auto main' onSubmit={handleSubmit} >
                <label htmlFor="name">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                <label htmlFor="email">Email Address </label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
                <label htmlFor="code">Referral Code</label>
                <input type="text" name="code" value={formData.code} onChange={handleChange} />
                {<div className="text-red-500 mt-2 font-bold">{errorMessage}</div>}
                <p className='text-center text-lg font-semibold my-2'> Already have an account? <Link href={"/"} className='text-blue-500'> Sign In </Link></p>
                <input type="submit" value="Sign Up" className="cursor-pointer inputField text-center bg-black text-white " />
            </form>
        </main>
    </>

    )
}
export default Signup