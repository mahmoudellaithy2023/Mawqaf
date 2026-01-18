import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../API/axios";

const useAdminStation = () => {
    const { user } = useSelector((state) => state.auth);
    const [station, setStation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStation = async () => {
            if (!user || user.role !== "ADMIN") {
                setLoading(false);
                return;
            }

            try {
                // Fetch all stations to find the one assigned to this admin
                // Ideal: /api/station/me or similar, but using getAll for now
                const res = await API.get("/station");
                const allStations = res.data.data || [];

                // Find station where admin ID matches current user ID
                const assignedStation = allStations.find(s => s.admin === user.id);

                if (assignedStation) {
                    setStation(assignedStation);
                } else {
                    setError(" لم يتم تعيين محطة لك بعد.");
                }
            } catch (err) {
                console.error(err);
                setError("فشل في تحميل بيانات المحطة");
            } finally {
                setLoading(false);
            }
        };

        fetchStation();
    }, [user]);

    return { station, loading, error };
};

export default useAdminStation;
