import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button, Card } from 'react-bootstrap';

const Scanner = ({ onScan, onClose }) => {
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);

    useEffect(() => {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const config = {
            fps: 20,
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

        const startScanner = async () => {
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
            } catch (err) {
                console.error("Unable to start scanner", err);
                setError("Kameraga ulanishda xatolik yuz berdi. Iltimos, brauzer sozlamalaridan ruxsat berilganini tekshiring.");
                setIsInitializing(false);
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(err => console.error("Error on unmount stop", err));
            }
        };
    }, [onScan]);

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
                            <p className="mb-2">Dastur ishlashi uchun kameradan foydalanishga ruxsat berishingiz kerak.</p>
                            <p className="mb-0">Agarda ruxsat berishda muammo bo'lsa, brauzer sozlamalaridan kamerani yoqib, sahifani yangilang.</p>
                        </div>
                        <Button variant="success" className="w-100 py-3 rounded-3 fw-bold shadow-sm" onClick={() => window.location.reload()}>
                            Sahifani yangilash
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

                {!error && (
                    <div className="mt-5 text-center px-4">
                        <p className="text-white fw-bold fs-5 mb-1">Position the QR code</p>
                        <p className="text-white-50 small mb-0">Biz yaratgan mahsulot kodlarini kameraga tuting.</p>
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
                            Dastur faqat skanerlash jarayonida kameradan foydalanadi.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Scanner;
