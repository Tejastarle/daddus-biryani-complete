/**
 * Single place for business details used across the site.
 * Update here and every page, the PDF footer excepted, picks it up.
 */
export const SITE = {
  name: "Daddu's Biryani",
  tagline: 'Zayqo ki Kahani',
  taglineHindi: 'जायकों की कहानी',
  url: 'https://daddusbiryani.com',
  phoneDisplay: '+91 96196 11561',
  phoneTel: '+919619611561',
  whatsapp: '919619611561',
  email: 'info@daddusbiryani.com',
  addressLines: ['Second Floor, A-Wing, Express Zone', 'Malad East, Mumbai 400097'],
  mapsLink:
    'https://www.google.com/maps/search/?api=1&query=Daddus+Biryani+Express+Zone+Malad+East+Mumbai',
  mapsEmbed:
    'https://maps.google.com/maps?q=Express%20Zone%2C%20Malad%20East%2C%20Mumbai%20400097&z=16&output=embed',
  hours: '11 AM – 11 PM, every day',
  rating: '4.8',
  reviews: '242',
  menuPdf: '/downloads/daddus-biryani-menu.pdf',
  menuXlsx: '/downloads/daddus-biryani-menu.xlsx',
  heroVideo: '/video/hero-video.mp4',
  heroPoster: '/images/hero-poster.webp',
};

export function waLink(text = "Hi Daddu's Biryani, I'd like to place an order.") {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

/**
 * Turn a Google Drive share link or file ID into a direct image URL.
 * The file must be shared as "Anyone with the link".
 * Example: driveImage('https://drive.google.com/file/d/FILE_ID/view') -> https://lh3.googleusercontent.com/d/FILE_ID
 */
export function driveImage(linkOrId: string, width = 1600) {
  const match = linkOrId.match(/\/d\/([a-zA-Z0-9_-]{20,})/) || linkOrId.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  const id = match ? match[1] : linkOrId;
  return `https://lh3.googleusercontent.com/d/${id}=w${width}`;
}

export const PHOTOS = {
  kolkata: { src: '/images/dishes/kolkata-biryani.webp', alt: 'Kolkata chicken biryani with boiled eggs and aloo in a brass handi', w: 1120, h: 968 },
  soya: { src: '/images/dishes/soya-chunks-biryani.webp', alt: 'Soya chunks dum biryani with fried onions', w: 1350, h: 915 },
  mumbai: { src: '/images/dishes/mumbai-twist-biryani.webp', alt: 'Mumbai Twist chicken biryani on a black plate', w: 1350, h: 905 },
  hyderabadi: { src: '/images/dishes/chicken-hyderabadi-biryani.webp', alt: 'Chicken Hyderabadi biryani with two drumsticks', w: 1350, h: 885 },
  vegHyderabadi: { src: '/images/dishes/veg-hyderabadi-biryani.webp', alt: 'Veg Hyderabadi biryani with peas and carrots', w: 1350, h: 935 },
  muttonYakhni: { src: '/images/dishes/mutton-yakhni-pulao.webp', alt: 'Mutton yakhni pulao with bone-in mutton pieces', w: 1350, h: 840 },
  lucknowi: { src: '/images/dishes/chicken-lucknowi-biryani.webp', alt: 'Chicken Lucknowi dum biryani with drumsticks', w: 1350, h: 855 },
  egg: { src: '/images/dishes/egg-biryani.webp', alt: 'Egg biryani with masala eggs', w: 1350, h: 845 },
  vegLucknowi: { src: '/images/dishes/veg-lucknowi-biryani.webp', alt: 'Veg dum biryani in a white bowl', w: 1350, h: 1080 },
  shami: { src: '/images/dishes/chicken-shami-kebab.webp', alt: 'Chicken shami kebabs with green chutney', w: 1350, h: 1080 },
  vegDum: { src: '/images/dishes/veg-dum-biryani.webp', alt: 'Veg dum biryani with raita', w: 1350, h: 1080 },
  seekh: { src: '/images/dishes/chicken-seekh-kebab.webp', alt: 'Chicken seekh kebabs with mint chutney', w: 1350, h: 1080 },
  chickenDum: { src: '/images/dishes/chicken-dum-biryani.webp', alt: 'Chicken dum biryani in an oval dish', w: 1350, h: 1080 },
  shamiParatha: { src: '/images/dishes/shami-kebab-paratha.webp', alt: 'Shami kebabs served with laccha paratha', w: 1350, h: 1080 },
} as const;
