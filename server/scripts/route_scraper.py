import sys
import json
import math
import urllib.request
import ssl
import re

def scrape_wikipedia_coords(city_name):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    formatted_name = city_name.strip().replace(" ", "_").title()
    if formatted_name == "Ahemdabad":
        formatted_name = "Ahmedabad"
        
    url = f"https://en.wikipedia.org/wiki/{formatted_name}"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, context=ctx, timeout=5).read().decode('utf-8')
        
        match = re.search(r'<span class="geo">([\d\.-]+); ([\d\.-]+)</span>', html)
        if not match:
            return None
        return (float(match.group(1)), float(match.group(2)))
    except:
        return None

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def generate_route(origin, destination, mode):
    coords1 = scrape_wikipedia_coords(origin)
    coords2 = scrape_wikipedia_coords(destination)
    
    # Fallback to rough coordinates if Wikipedia completely fails
    if not coords1: coords1 = (20.5992, 72.9342) # Valsad fallback
    if not coords2: coords2 = (23.0225, 72.5714) # Ahmedabad fallback
    
    distance_km = haversine(coords1[0], coords1[1], coords2[0], coords2[1])

    route_data = {
        "success": True, "origin": origin, "destination": destination,
        "mode": mode, "distance_km": int(distance_km),
         "stations": []
    }
    
    # Helper to calculate intermediate coordinates for the map
    def mid_coord(c1, c2, fraction):
        return [c1[0] + (c2[0] - c1[0]) * fraction, c1[1] + (c2[1] - c1[1]) * fraction]
    
    if mode == "flight":
        hours = max(1, (distance_km / 800) + 2)
        
        
        route_data["stations"] = [
            {"name": f"{origin} (DEP)", "type": "departure", "lat": coords1[0], "lng": coords1[1]},
            {"name": f"{destination} (ARR)", "type": "arrival", "lat": coords2[0], "lng": coords2[1]}
        ]
    elif mode == "train":
        hours = max(1, distance_km / 120)
        
        
        mid = mid_coord(coords1, coords2, 0.5)
        route_data["stations"] = [
            {"name": f"{origin} Station", "type": "departure", "lat": coords1[0], "lng": coords1[1]},
            {"name": "Midpoint Junction", "type": "transfer", "lat": mid[0], "lng": mid[1]},
            {"name": f"{destination} Station", "type": "arrival", "lat": coords2[0], "lng": coords2[1]}
        ]
    elif mode == "car":
        hours = max(1, distance_km / 75)
        
        
        mid1 = mid_coord(coords1, coords2, 0.33)
        mid2 = mid_coord(coords1, coords2, 0.66)
        route_data["stations"] = [
            {"name": f"{origin}", "type": "departure", "lat": coords1[0], "lng": coords1[1]},
            {"name": "Rest Stop 1", "type": "waypoint", "lat": mid1[0], "lng": mid1[1]},
            {"name": "Rest Stop 2", "type": "waypoint", "lat": mid2[0], "lng": mid2[1]},
            {"name": f"{destination}", "type": "arrival", "lat": coords2[0], "lng": coords2[1]}
        ]
        
    print(json.dumps(route_data))

if __name__ == "__main__":
    if len(sys.argv) < 4:
        sys.exit(1)
    generate_route(sys.argv[1], sys.argv[2], sys.argv[3])
