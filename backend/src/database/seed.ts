import { DataSource } from 'typeorm';
import { City } from '../cities/city.entity';
import { Activity } from '../activities/activity.entity';

const INDIA_CITIES = [
  // Hill Stations
  { id: 'manali', name: 'Manali', state: 'Himachal Pradesh', region: 'North India', type: 'hill-station', costIndex: 'medium', popularity: 95, description: 'Gateway to the Himalayas with stunning valleys', image: 'manali' },
  { id: 'shimla', name: 'Shimla', state: 'Himachal Pradesh', region: 'North India', type: 'hill-station', costIndex: 'medium', popularity: 92, description: 'The Queen of Hills, former British summer capital', image: 'shimla' },
  { id: 'ooty', name: 'Ooty', state: 'Tamil Nadu', region: 'South India', type: 'hill-station', costIndex: 'low', popularity: 88, description: 'Queen of Nilgiris surrounded by tea gardens', image: 'ooty' },
  { id: 'munnar', name: 'Munnar', state: 'Kerala', region: 'South India', type: 'hill-station', costIndex: 'medium', popularity: 90, description: 'Lush tea plantations and misty mountains', image: 'munnar' },
  { id: 'darjeeling', name: 'Darjeeling', state: 'West Bengal', region: 'East India', type: 'hill-station', costIndex: 'medium', popularity: 87, description: 'World-famous tea and Himalayan views', image: 'darjeeling' },
  { id: 'mussoorie', name: 'Mussoorie', state: 'Uttarakhand', region: 'North India', type: 'hill-station', costIndex: 'medium', popularity: 89, description: 'Queen of the Hills near Dehradun', image: 'mussoorie' },
  { id: 'kodaikanal', name: 'Kodaikanal', state: 'Tamil Nadu', region: 'South India', type: 'hill-station', costIndex: 'low', popularity: 83, description: 'Princess of Hill Stations with serene lake', image: 'kodaikanal' },
  { id: 'coorg', name: 'Coorg', state: 'Karnataka', region: 'South India', type: 'hill-station', costIndex: 'medium', popularity: 86, description: 'Scotland of India with coffee estates', image: 'coorg' },
  // Beaches
  { id: 'goa', name: 'Goa', state: 'Goa', region: 'West India', type: 'beach', costIndex: 'medium', popularity: 98, description: 'India\'s beach paradise with vibrant nightlife', image: 'goa' },
  { id: 'varkala', name: 'Varkala', state: 'Kerala', region: 'South India', type: 'beach', costIndex: 'low', popularity: 82, description: 'Stunning cliffside beach with mineral springs', image: 'varkala' },
  { id: 'pondicherry', name: 'Pondicherry', state: 'Puducherry', region: 'South India', type: 'beach', costIndex: 'low', popularity: 85, description: 'French Riviera of the East', image: 'pondicherry' },
  { id: 'andaman', name: 'Andaman Islands', state: 'Andaman & Nicobar', region: 'Islands', type: 'beach', costIndex: 'high', popularity: 93, description: 'Pristine beaches and vibrant coral reefs', image: 'andaman' },
  { id: 'lakshadweep', name: 'Lakshadweep', state: 'Lakshadweep', region: 'Islands', type: 'beach', costIndex: 'high', popularity: 78, description: 'Coral paradise with crystal-clear lagoons', image: 'lakshadweep' },
  { id: 'kovalam', name: 'Kovalam', state: 'Kerala', region: 'South India', type: 'beach', costIndex: 'low', popularity: 81, description: 'Crescent-shaped beach with lighthouse', image: 'kovalam' },
  // Heritage & Cultural
  { id: 'agra', name: 'Agra', state: 'Uttar Pradesh', region: 'North India', type: 'heritage', costIndex: 'low', popularity: 97, description: 'Home of the magnificent Taj Mahal', image: 'agra' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', region: 'North India', type: 'heritage', costIndex: 'medium', popularity: 96, description: 'Pink City with royal palaces and forts', image: 'jaipur' },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', region: 'North India', type: 'heritage', costIndex: 'low', popularity: 91, description: 'Oldest living city on the Ganges', image: 'varanasi' },
  { id: 'hampi', name: 'Hampi', state: 'Karnataka', region: 'South India', type: 'heritage', costIndex: 'low', popularity: 84, description: 'UNESCO World Heritage ruins of Vijayanagara', image: 'hampi' },
  { id: 'khajuraho', name: 'Khajuraho', state: 'Madhya Pradesh', region: 'Central India', type: 'heritage', costIndex: 'low', popularity: 80, description: 'Medieval temples with intricate sculptures', image: 'khajuraho' },
  // Tropical / Backwaters
  { id: 'kerala-backwaters', name: 'Alleppey', state: 'Kerala', region: 'South India', type: 'tropical', costIndex: 'medium', popularity: 94, description: 'Venice of the East with serene backwaters', image: 'alleppey' },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', region: 'South India', type: 'tropical', costIndex: 'low', popularity: 72, description: 'Gateway to Nilgiris with pleasant climate', image: 'coimbatore' },
  // Metro / Urban
  { id: 'delhi', name: 'New Delhi', state: 'Delhi', region: 'North India', type: 'metro', costIndex: 'medium', popularity: 99, description: 'India\'s capital with history and modernity', image: 'delhi' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', region: 'West India', type: 'metro', costIndex: 'high', popularity: 98, description: 'City of Dreams and financial capital', image: 'mumbai' },
  { id: 'bangalore', name: 'Bengaluru', state: 'Karnataka', region: 'South India', type: 'metro', costIndex: 'high', popularity: 95, description: 'Silicon Valley of India', image: 'bangalore' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', region: 'East India', type: 'metro', costIndex: 'low', popularity: 88, description: 'City of Joy and cultural heart of India', image: 'kolkata' },
  // Desert
  { id: 'jaisalmer', name: 'Jaisalmer', state: 'Rajasthan', region: 'North India', type: 'desert', costIndex: 'medium', popularity: 89, description: 'Golden City in the heart of Thar desert', image: 'jaisalmer' },
  { id: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan', region: 'North India', type: 'desert', costIndex: 'medium', popularity: 88, description: 'Blue City with majestic Mehrangarh Fort', image: 'jodhpur' },
  // Wildlife
  { id: 'ranthambore', name: 'Ranthambore', state: 'Rajasthan', region: 'North India', type: 'wildlife', costIndex: 'high', popularity: 87, description: 'Famous tiger reserve in Rajasthan', image: 'ranthambore' },
  { id: 'jim-corbett', name: 'Jim Corbett', state: 'Uttarakhand', region: 'North India', type: 'wildlife', costIndex: 'high', popularity: 86, description: 'India\'s oldest national park', image: 'corbett' },
  { id: 'kaziranga', name: 'Kaziranga', state: 'Assam', region: 'Northeast India', type: 'wildlife', costIndex: 'medium', popularity: 85, description: 'UNESCO park home to one-horned rhinos', image: 'kaziranga' },
];

const ACTIVITIES = [
  // Manali
  { id: 'a1', name: 'Rohtang Pass Snow Experience', city: 'Manali', category: 'adventure', cost: 800, duration: 8, description: 'Drive to the famous Rohtang Pass for snow activities' },
  { id: 'a2', name: 'Solang Valley Paragliding', city: 'Manali', category: 'adventure', cost: 1500, duration: 3, description: 'Thrilling paragliding over the beautiful Solang Valley' },
  { id: 'a3', name: 'Old Manali Cafe Hop', city: 'Manali', category: 'food', cost: 400, duration: 2, description: 'Explore cozy cafes and taste local Himachali food' },
  // Goa
  { id: 'a4', name: 'North Goa Beach Party', city: 'Goa', category: 'leisure', cost: 500, duration: 4, description: 'Experience the legendary Goa beach nightlife' },
  { id: 'a5', name: 'Scuba Diving - Baga', city: 'Goa', category: 'adventure', cost: 2500, duration: 3, description: 'Explore coral reefs in the Arabian Sea' },
  { id: 'a6', name: 'Spice Plantation Tour', city: 'Goa', category: 'sightseeing', cost: 600, duration: 3, description: 'Visit a traditional Goan spice plantation' },
  // Jaipur
  { id: 'a7', name: 'Amber Fort Elephant Ride', city: 'Jaipur', category: 'cultural', cost: 1200, duration: 2, description: 'Majestic elephant ride to Amber Fort' },
  { id: 'a8', name: 'Pink City Heritage Walk', city: 'Jaipur', category: 'cultural', cost: 300, duration: 3, description: 'Guided walk through old Jaipur bazaars' },
  { id: 'a9', name: 'Rajasthani Dinner Show', city: 'Jaipur', category: 'food', cost: 1500, duration: 3, description: 'Traditional folk dances with authentic cuisine' },
  // Agra
  { id: 'a10', name: 'Taj Mahal Sunrise Visit', city: 'Agra', category: 'sightseeing', cost: 1100, duration: 3, description: 'Witness the Taj at golden sunrise hour' },
  { id: 'a11', name: 'Agra Fort Tour', city: 'Agra', category: 'cultural', cost: 550, duration: 2, description: 'Explore the magnificent Mughal fort' },
  // Munnar
  { id: 'a12', name: 'Tea Estate Tour', city: 'Munnar', category: 'sightseeing', cost: 400, duration: 3, description: 'Walk through lush green tea gardens' },
  { id: 'a13', name: 'Eravikulam Trekking', city: 'Munnar', category: 'adventure', cost: 600, duration: 5, description: 'Trek in Eravikulam National Park' },
  // Alleppey
  { id: 'a14', name: 'Houseboat Backwater Cruise', city: 'Alleppey', category: 'leisure', cost: 6000, duration: 24, description: 'Overnight luxury houseboat in Kerala backwaters' },
  { id: 'a15', name: 'Kayaking in Backwaters', city: 'Alleppey', category: 'adventure', cost: 800, duration: 2, description: 'Kayak through tranquil backwater canals' },
  // Varanasi
  { id: 'a16', name: 'Ganga Aarti Ceremony', city: 'Varanasi', category: 'cultural', cost: 0, duration: 2, description: 'Witness the mesmerizing evening Ganga Aarti' },
  { id: 'a17', name: 'Boat Ride at Sunrise', city: 'Varanasi', category: 'sightseeing', cost: 400, duration: 2, description: 'Row on the Ganges at dawn' },
  // Jaisalmer
  { id: 'a18', name: 'Camel Safari in Thar', city: 'Jaisalmer', category: 'adventure', cost: 1800, duration: 4, description: 'Camel safari through golden sand dunes' },
  { id: 'a19', name: 'Desert Camping Night', city: 'Jaisalmer', category: 'leisure', cost: 3000, duration: 12, description: 'Stargazing and bonfire camp in the desert' },
  // Darjeeling
  { id: 'a20', name: 'Toy Train Ride', city: 'Darjeeling', category: 'sightseeing', cost: 700, duration: 2, description: 'UNESCO heritage Darjeeling Himalayan Railway' },
  { id: 'a21', name: 'Tiger Hill Sunrise', city: 'Darjeeling', category: 'sightseeing', cost: 300, duration: 3, description: 'Watch sunrise over Kanchenjunga peaks' },
];

export async function runSeed(dataSource: DataSource) {
  const cityRepo = dataSource.getRepository(City);
  const activityRepo = dataSource.getRepository(Activity);

  const cityCount = await cityRepo.count();
  if (cityCount === 0) {
    console.log('Seeding cities...');
    await cityRepo.save(INDIA_CITIES);
  }

  const activityCount = await activityRepo.count();
  if (activityCount === 0) {
    console.log('Seeding activities...');
    await activityRepo.save(ACTIVITIES);
  }
}
