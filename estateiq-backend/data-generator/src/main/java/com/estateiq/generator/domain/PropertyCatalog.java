package com.estateiq.generator.domain;

import com.estateiq.generator.CityProfile;
import com.estateiq.generator.LocalityProfile;

import java.util.List;

public final class PropertyCatalog {
    private PropertyCatalog() {
    }

    public static List<CityProfile> profiles() {
        return List.of(
                city("Mumbai", locality("Andheri West", 19.1364, 72.8296, 32000), locality("Powai", 19.1176, 72.9060, 28000), locality("Bandra", 19.0607, 72.8362, 45000)),
                city("Delhi", locality("Dwarka", 28.5921, 77.0460, 11000), locality("Rohini", 28.7495, 77.0565, 9500), locality("Vasant Kunj", 28.5421, 77.1550, 18000)),
                city("Bangalore", locality("Whitefield", 12.9698, 77.7500, 12000), locality("Koramangala", 12.9352, 77.6245, 18000), locality("Electronic City", 12.8452, 77.6602, 8500)),
                city("Hyderabad", locality("Gachibowli", 17.4401, 78.3489, 9000), locality("Kondapur", 17.4697, 78.3657, 8500), locality("Banjara Hills", 17.4156, 78.4347, 14000)),
                city("Chennai", locality("Adyar", 13.0067, 80.2572, 11000), locality("Velachery", 12.9815, 80.2180, 8000), locality("Anna Nagar", 13.0850, 80.2101, 12000)),
                city("Pune", locality("Hinjewadi", 18.5913, 73.7389, 7500), locality("Kothrud", 18.5074, 73.8077, 9500), locality("Viman Nagar", 18.5679, 73.9143, 10500)),
                city("Ahmedabad", locality("Prahlad Nagar", 23.0125, 72.5108, 7000), locality("Satellite", 23.0258, 72.5185, 7500), locality("Bopal", 22.9420, 72.4650, 5500)),
                city("Kolkata", locality("Salt Lake", 22.5958, 88.4497, 7000), locality("New Town", 22.5867, 88.4753, 6500), locality("Alipore", 22.5300, 88.3300, 10000)),
                city("Jaipur", locality("Malviya Nagar", 26.8500, 75.8100, 5500), locality("Vaishali Nagar", 26.9120, 75.7380, 5000)),
                city("Surat", locality("Vesu", 21.1430, 72.7700, 5500), locality("Adajan", 21.2000, 72.8000, 4500)),
                city("Vadodara", locality("Alkapuri", 22.3100, 73.1700, 5500), locality("Gotri", 22.2900, 73.1400, 4000)),
                city("Noida", locality("Sector 62", 28.6270, 77.3650, 8000), locality("Sector 137", 28.5100, 77.3950, 6500)),
                city("Gurgaon", locality("Golf Course Road", 28.4600, 77.0900, 15000), locality("Sohna Road", 28.4100, 77.0400, 8500)),
                city("Lucknow", locality("Gomti Nagar", 26.8500, 81.0000, 5000), locality("Hazratganj", 26.8500, 80.9500, 6000)),
                city("Indore", locality("Vijay Nagar", 22.7500, 75.8900, 5000), locality("Rau", 22.6400, 75.8000, 3500)),
                city("Kochi", locality("Kakkanad", 10.0150, 76.3600, 5500), locality("Edappally", 10.0260, 76.3100, 6000))
        );
    }

    private static CityProfile city(String name, LocalityProfile... localities) {
        return new CityProfile(name, List.of(localities));
    }

    private static LocalityProfile locality(String name, double latitude, double longitude, double basePricePerSqft) {
        return new LocalityProfile("", name, latitude, longitude, basePricePerSqft);
    }
}
