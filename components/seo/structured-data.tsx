export const StructuredData = () => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Pro Innovation & Technologies",
        "image": "https://proinnovation.tech/og-image.jpg",
        "telephone": "+254715947213",
        "email": "info@proinnovationtech.co.ke",
        "url": "https://proinnovation.tech",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Machakos",
            "addressRegion": "Machakos County",
            "addressCountry": "KE"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -1.5177,
            "longitude": 37.2634
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
            ],
            "opens": "08:00",
            "closes": "17:00"
        },
        "sameAs": [
            "https://facebook.com/proinnovationtech",
            "https://twitter.com/proinnovationtech",
            "https://instagram.com/proinnovationtech"
        ],
        "priceRange": "$$"
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
};
