import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button, Card } from 'react-bootstrap';

const Scanner = ({ onScan, onClose }) => {
    const [isInitializing, setIsInitializing] = useState(false);
    const [error, setError] = useState(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [permissionState, setPermissionState] = useState('prompt'); // 'prompt', 'granted', 'denied'
    const scannerRef = useRef(null);

    useEffect(() => {
        // Check permission state on mount
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'camera' })
                .then(result => {
                    setPermissionState(result.state);
                    result.onchange = () => setPermissionState(result.state);
                }).catch(err => {
                    console.error("Permission query not supported", err);
                });
        }
    }, []);

    const startScanner = async () => {
        setIsInitializing(true);
        setError(null);

        // Cleanup existing if any
        if (scannerRef.current && scannerRef.current.isScanning) {
            await scannerRef.current.stop().catch(() => { });
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

        try {
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
            setIsInitializing(false);
            setHasStarted(true);
        } catch (err) {
            console.error("Unable to start scanner", err);
            setError("Kameraga ulanishda xatolik yuz berdi. Iltimos, ruxsat berilganini tekshiring.");
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
                        <p className="text-white-50 small mb-5">Skanerlashni boshlash uchun "Ruxsat Berish" tugmasini bosing va kameraga ruxsat bering.</p>
                        <Button
                            variant="success"
                            size="lg"
                            className="w-100 py-3 rounded-4 fw-black shadow-lg"
                            onClick={startScanner}
                            disabled={isInitializing}
                        >
                            {isInitializing ? 'Yuklanmoqda...' : 'Ruxsat Berish & Skanerlash'}
                        </Button>
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
