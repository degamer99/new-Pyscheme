import { useState } from 'react';

const CopyCodeToClipboard = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000); // Reset the copied state after 2 seconds
  };

  return (
    <div className='tooltip w-auto overflow-hidden'>
      <code  title='Click to Copy' onClick={copyToClipboard} >{code}</code>
      <button className='tooltiptext' onClick={copyToClipboard}>{copied ? 'Copied!' : 'Copy'}</button>
    </div>
  );
};

export default CopyCodeToClipboard;
