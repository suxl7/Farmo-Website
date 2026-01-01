const Footer = () => {
return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-3">Farmo</h3>
                    <p className="text-gray-300 text-sm">Connecting farmers and consumers for a sustainable agricultural ecosystem.</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Contact Us</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                        <p className="flex items-center gap-2"><img src="/gmail.png" alt="Gmail" className="w-4 h-4"/> info@farmo.com</p>
                        <p className="flex items-center gap-2"><img src="/phone-call.png" alt="Phone" className="w-4 h-4"/> +977 9815672915</p>
                        <p className="flex items-center gap-2"><img src="/placeholder.png" alt="Location" className="w-4 h-4"/> Dhangadhi, Kailali</p>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Quick Links</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                        <p>About Us</p>
                        <p>Privacy Policy</p>
                        <p>Terms of Service</p>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
                © 2024 Farmo. All rights reserved.
            </div>
        </div>
    </footer>
);
};

export default Footer;
