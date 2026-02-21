import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button, Card } from 'react-bootstrap';

const Scanner = ({ onScan, onClose }) => {
    const [isInitializing, setIsInitializing] = useState(false);
    const [error, setError] = useState(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [diagnostics, setDiagnostics] = useState({ supported: 'checking...', devices: [] });
    const scannerRef = useRef(null);

    useEffect(() => {
        const checkSupport = async () => {
            const support = { supported: false, devices: [] };
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                support.supported = true;
                try {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    support.devices = devices.filter(d => d.kind === 'videoinput');
                } catch (e) {
                    console.error("Device enumeration failed", e);
                }
            }
            setDiagnostics(support);
        };
        checkSupport();
    }, []);

    const startScanner = async () => {
        setIsInitializing(true);
        setError(null);

        // 10 second timeout to prevent infinite "Yuklanmoqda..." state
        const timeoutId = setTimeout(() => {
            if (isInitializing) {
                setIsInitializing(false);
                setError("Kamera yuklanishi juda uzoq davom etmoqda. Iltimos, sahifani yangilang yoki kamerangiz boshqa dasturda ishlatilmayotganiga ishonch hosil qiling.");
                if (scannerRef.current) {
                    scannerRef.current.stop().catch(() => { });
                }
            }
        }, 10000);

        try {
            // Cleanup existing if any
            if (scannerRef.current) {
                try {
                    if (scannerRef.current.isScanning) {
                        await scannerRef.current.stop();
                    }
                    scannerRef.current.clear();
                } catch (e) {
                    console.log("Cleanup error (ignored)", e);
                }
            }

            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;

            const config = {
                fps: 25,
                qrbox: (viewfinderWidth, viewfinderHeight) => {
                    const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
                    const qrboxSize = Math.floor(minEdgeSize * 0.7);
                    return { width: qrboxSize, height: qrboxSize };
                },
                aspectRatio: 1.0,
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.QR_CODE,
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.CODE_128
                ]
            };

            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    html5QrCode.stop().then(() => {
                        onScan(decodedText);
                    }).catch(() => onScan(decodedText));
                },
                () => { }
            );

            clearTimeout(timeoutId);
            setIsInitializing(false);
            setHasStarted(true);
        } catch (err) {
            clearTimeout(timeoutId);
            console.error("Unable to start scanner", err);

            let userFriendlyError = "Kameraga ulanishda xatolik yuz berdi.";
            if (err.includes("NotAllowedError") || err.includes("Permission denied")) {
                userFriendlyError = "Kameraga ruxsat berilmadi. Iltimos, brauzer sozlamalaridan ruxsat bering.";
            } else if (err.includes("NotFoundError")) {
                userFriendlyError = "Qurilmangizda kamera topilmadi.";
            }

            setError(userFriendlyError);
            setIsInitializing(false);
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(err => console.error("Error on unmount stop", err));
            }
        };
    }, []);

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column p-4 z-idx-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(15px)', zIndex: 2000 }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-success p-2 rounded-3 text-white shadow-sm">
                        <Camera size={20} />
                    </div>
                    <span className="fw-bold text-white fs-5">Product Scanner</span>
                </div>
                <Button
                    variant="link"
                    onClick={onClose}
                    className="p-2 text-white opacity-75 hover-opacity-100 text-decoration-none"
                >
                    <X size={28} />
                </Button>
            </div>

            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                {error ? (
                    <div className="text-center p-4 glass-card mx-3" style={{ maxWidth: '400px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                        <div className="text-danger mb-4">
                            <RefreshCw size={56} className="animate-pulse" />
                        </div>
                        <h4 className="text-white fw-bold mb-3">Kameraga ruxsat berilmadi</h4>
                        <div className="text-white-50 small mb-4 text-start">
                            <p className="mb-2">Dastur ishlashi uchun kameradan foydalanishga ruxsat berishingiz kerak. Ruxsatni qayta yoqish uchun:</p>
                            <ol className="ps-3 mb-0">
                                <li className="mb-1">Brauzerning manzil satridagi (tepadagi) <b>qulf (lock)</b> ikonkasini bosing.</li>
                                <li className="mb-1"><b>"Camera"</b> (yoki "Kamera") bo'limini toping va uni yoqing.</li>
                                <li>Sahifani yangilang (F5).</li>
                            </ol>
                        </div>
                        <Button variant="success" className="w-100 py-3 rounded-3 fw-bold shadow-sm" onClick={() => window.location.reload()}>
                            Sahifani yangilash
                        </Button>
                    </div>
                ) : !hasStarted ? (
                    <div className="text-center p-5 glass-card mx-3" style={{ maxWidth: '400px' }}>
                        <div className="bg-success bg-opacity-10 p-4 rounded-circle mx-auto mb-4" style={{ width: '100px', height: '100px' }}>
                            <Camera size={52} className="text-success" />
                        </div>
                        <h3 className="text-white fw-bold mb-3">Kamerani yoqing</h3>
                        <p className="text-white-50 small mb-4">Skanerlashni boshlash uchun "Ruxsat Berish" tugmasini bosing va kameraga ruxsat bering.</p>

                        {/* Diagnostic Info */}
                        <div className="bg-white bg-opacity-5 rounded-3 p-3 mb-4 text-start border border-white border-opacity-10">
                            <p className="text-white-50 xs-small mb-1 fw-bold text-uppercase" style={{ fontSize: '10px' }}>Tizim holati:</p>
                            <p className="text-white small mb-0" style={{ fontSize: '12px' }}>
                                <span className={diagnostics.supported ? 'text-success' : 'text-danger'}>
                                    ● {diagnostics.supported ? 'Kamera qo\'llab-quvvatlanadi' : 'Kamera topilmadi'}
                                </span>
                                <br />
                                <span className="opacity-50">Kamerlar soni: {diagnostics.devices.length}ta</span>
                            </p>
                        </div>

                        <Button
                            variant="success"
                            size="lg"
                            className="w-100 py-3 rounded-4 fw-black shadow-lg mb-3"
                            onClick={startScanner}
                            disabled={isInitializing}
                        >
                            {isInitializing ? 'Yuklanmoqda...' : 'Ruxsat Berish & Skanerlash'}
                        </Button>
                        <p className="text-white-50 small" style={{ fontSize: '10px' }}>
                            Agar ruxsat so'ramasa, brauzeringizda <b>HTTPS</b> ishlayotganiga yoki <b>localhost</b> ekaniga ishonch hosil qiling.
                        </p>
                    </div>
                ) : (
                    <div className="position-relative w-100 overflow-hidden rounded-5 shadow-2xl bg-black" style={{ maxWidth: '400px', aspectRatio: '1/1' }}>
                        {isInitializing && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white z-idx-10 pb-5">
                                <div className="spinner-border text-success mb-3" role="status"></div>
                                <span className="small fw-bold opacity-75">Kamera ishga tushmoqda...</span>
                            </div>
                        )}

                        <div id="reader" className="w-100 h-100"></div>

                        {/* Custom Overlay for Focus */}
                        {!isInitializing && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none d-flex flex-column align-items-center justify-content-center p-5" style={{ pointerEvents: 'none' }}>
                                <div className="w-75 h-75 border border-2 border-success border-dashed rounded-5 opacity-40 animate-pulse"></div>
                                <div className="scan-animation"></div>
                            </div>
                        )}
                    </div>
                )}

                {hasStarted && !error && (
                    <div className="mt-5 text-center px-4">
                        <p className="text-white fw-bold fs-5 mb-1">Position the QR code</p>
                        <p className="text-white-50 small mb-0">Biz yaratgan mahsulot kodlarini kameraga yaqinroq tuting.</p>
                    </div>
                )}
            </div>

            {/* Footer Instructions */}
            <Card className="bg-white bg-opacity-5 border-white border-opacity-10 rounded-4 mt-auto p-3">
                <div className="d-flex align-items-start gap-3 text-start">
                    <div className="text-success mt-1">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-white small fw-bold mb-1">Safe Scanner</p>
                        <p className="text-white-50 mb-0" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                            Dastur ma'lumotlaringizni xavfsiz saqlaydi. Faqat skanerlash jarayonida kameradan foydalanadi.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Scanner;
