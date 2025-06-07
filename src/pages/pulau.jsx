// src/pages/pulau.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getProvinces } from '@/lib/api'; 

const Pulau = () => {
    const [pulauData, setPulauData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPulau = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getProvinces(); 
                console.log('Respons API /provinsi:', response); 

                let fetchedPulau = [];
                if (response && response.data && response.data.provinsi && Array.isArray(response.data.provinsi.data)) {
                    fetchedPulau = response.data.provinsi.data.map(prov => ({
                        id: prov.id,
                        title: prov.nama,
                        imageUrl: prov.gambar,
                        description: `Menampilkan keindahan seni dan budaya ${prov.nama}.`, 
                        path: `/${prov.nama.toLowerCase().replace(/\s/g, '-')}`, 
                    }));
                } else {
                    console.warn("Struktur respons API /provinsi tidak sesuai harapan.");
                    setError("Gagal memuat data Provinsi. Format data tidak sesuai.");
                }

                setPulauData(fetchedPulau);
            } catch (err) {
                console.error("Gagal memuat daftar Provinsi:", err);
                setError("Gagal memuat daftar Provinsi. Silakan coba lagi nanti.");
                setPulauData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPulau();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-600 py-10">Memuat Provinsi...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">{error}</div>;
    }

    if (pulauData.length === 0) {
        return <div className="text-center text-gray-600 py-10">Tidak ada provinsi yang tersedia.</div>;
    }

    return (
        <div className="flex flex-wrap justify-center">
            {pulauData.map((section) => (
                <div
                    key={section.id}
                    className="flex flex-col items-center justify-center p-4 m-4 bg-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 w-80"
                >
                    <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                    <div className="relative">
                        <img
                            src={section.imageUrl} 
                            alt={section.title}
                            className="w-full h-48 object-cover rounded-lg brightness-75"
                        />
                    </div>
                    <p className="mt-2 text-center text-gray-700">{section.description}</p>
                    <Link
                        to={`/pulau/${section.id}`}
                        className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Lihat Detail
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Pulau;