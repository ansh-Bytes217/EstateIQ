package com.estateiq.generator;

import java.util.List;

public record CityProfile(String city, List<LocalityProfile> localities) {
}
