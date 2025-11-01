/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XIcon, DownloadIcon, CopyIcon, InstagramIcon, PinterestIcon, FacebookIcon, TwitterIcon, WhatsAppIcon, CheckIcon } from './icons';
import { translations } from '../lib/translations';

type Language = 'pt-br' | 'en';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  language: Language;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, imageUrl, language }) => {
  const [isCopied, setIsCopied] = useState(false);
  const t = translations[language];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `meu-look-virtual-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleCopyLink = () => {
    // In a real app, you would upload the image and get a shareable URL.
    // For this demo, we'll copy a placeholder URL.
    const placeholderUrl = `https://virtual-try-on.example.com/look/${Date.now()}`;
    navigator.clipboard.writeText(placeholderUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleSocialShare = (platform: 'pinterest' | 'twitter' | 'facebook' | 'whatsapp') => {
    const pageUrl = encodeURIComponent(`https://virtual-try-on.example.com/look/${Date.now()}`);
    const text = encodeURIComponent(t.shareText);
    const imageUrlEncoded = encodeURIComponent(imageUrl);

    let shareUrl = '';

    switch (platform) {
        case 'pinterest':
            // Pinterest needs an image URL. data: URLs might not work on all browsers/platforms.
            shareUrl = `https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${imageUrlEncoded}&description=${text}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${text}%20${pageUrl}`;
            break;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row shadow-xl overflow-hidden"
      >
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-4">
            <img src={imageUrl} alt={t.lookToShareAlt} className="max-w-full max-h-full h-[50vh] md:h-auto object-contain rounded-lg" />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col">
            <div className="flex justify-between items-start">
                <h2 className="text-3xl font-serif tracking-wider text-gray-800">{t.shareLook}</h2>
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <p className="mt-2 text-gray-600">{t.shareSubtitle}</p>
            
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                {/* For Instagram, direct sharing is not possible via web API. We guide the user. */}
                <a href={imageUrl} download={`meu-look-virtual-${Date.now()}.png`} title={t.downloadAndPost} className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <InstagramIcon className="w-8 h-8"/>
                    <span className="text-xs font-semibold">Instagram</span>
                </a>
                <button onClick={() => handleSocialShare('pinterest')} className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <PinterestIcon className="w-8 h-8"/>
                    <span className="text-xs font-semibold">Pinterest</span>
                </button>
                 <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <FacebookIcon className="w-8 h-8"/>
                    <span className="text-xs font-semibold">Facebook</span>
                </button>
                 <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <TwitterIcon className="w-8 h-8"/>
                    <span className="text-xs font-semibold">X / Twitter</span>
                </button>
                <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <WhatsAppIcon className="w-8 h-8"/>
                    <span className="text-xs font-semibold">WhatsApp</span>
                </button>
            </div>

            <div className="mt-auto pt-6 space-y-3">
                 <button onClick={handleCopyLink} className="w-full flex items-center justify-center gap-3 py-3 px-4 text-center bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    {isCopied ? <CheckIcon className="w-5 h-5 text-green-600"/> : <CopyIcon className="w-5 h-5"/>}
                    {isCopied ? t.linkCopied : t.copyLink}
                </button>
                <button onClick={handleDownload} className="w-full flex items-center justify-center gap-3 py-3 px-4 text-center bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                    <DownloadIcon className="w-5 h-5"/>
                    {t.downloadImageBtn}
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;
