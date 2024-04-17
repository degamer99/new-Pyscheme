import { MdShare } from "react-icons/md";
const ShareButton = ({ code }) => {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: 'Refer your friends and Earm more money',
                    url: `pyscheme.netlify.app/signup?r=${code}`
                });
                console.log('Link shared successfully');
            } catch (error) {
                console.error('Error sharing link:', error);
            }
        } else {
            console.warn('Web Share API not supported');
        }
    };

    return (<button onClick={handleShare}><MdShare /></button>
    );
};

export default ShareButton;