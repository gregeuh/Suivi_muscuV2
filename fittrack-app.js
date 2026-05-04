// Common French dishes database
const commonDishes = [
    { name: 'Steak-frites', calories: 800 },
    { name: 'Poulet rôti (1/4)', calories: 350 },
    { name: 'Saumon grillé', calories: 400 },
    { name: 'Pizza Margherita (entière)', calories: 1200 },
    { name: 'Pizza 4 fromages (entière)', calories: 1400 },
    { name: 'Pâtes carbonara', calories: 650 },
    { name: 'Pâtes bolognaise', calories: 550 },
    { name: 'Lasagnes', calories: 700 },
    { name: 'Burger classique', calories: 750 },
    { name: 'Burger double', calories: 1000 },
    { name: 'Croque-monsieur', calories: 500 },
    { name: 'Quiche lorraine', calories: 450 },
    { name: 'Salade César', calories: 400 },
    { name: 'Salade niçoise', calories: 350 },
    { name: 'Sandwich jambon-beurre', calories: 350 },
    { name: 'Sandwich poulet-crudités', calories: 400 },
    { name: 'Tacos (3 pièces)', calories: 800 },
    { name: 'Kebab', calories: 900 },
    { name: 'Sushi (12 pièces)', calories: 450 },
    { name: 'Riz cantonnais', calories: 650 },
    { name: 'Nouilles sautées', calories: 600 },
    { name: 'Poulet curry-riz', calories: 700 },
    { name: 'Couscous', calories: 750 },
    { name: 'Paella', calories: 650 },
    { name: 'Risotto', calories: 550 },
    { name: 'Gratin dauphinois', calories: 400 },
    { name: 'Blanquette de veau', calories: 550 },
    { name: 'Boeuf bourguignon', calories: 600 },
    { name: 'Pot-au-feu', calories: 450 },
    { name: 'Choucroute', calories: 800 },
    { name: 'Raclette (par personne)', calories: 900 },
    { name: 'Fondue savoyarde', calories: 850 },
    { name: 'Tartiflette', calories: 700 },
    { name: 'Moules-frites', calories: 650 },
    { name: 'Fish and chips', calories: 800 },
    { name: 'Omelette (3 œufs)', calories: 300 },
    { name: 'Crêpe jambon-fromage', calories: 350 },
    { name: 'Crêpe Nutella', calories: 400 },
    { name: 'Gaufre sucrée', calories: 350 },
    { name: 'Croissant', calories: 250 },
    { name: 'Pain au chocolat', calories: 280 },
    { name: 'Tartine beurre-confiture', calories: 200 },
    { name: 'Bol de céréales au lait', calories: 300 },
    { name: 'Yaourt + granola', calories: 250 },
    { name: 'Soupe de légumes', calories: 150 },
    { name: 'Velouté de champignons', calories: 200 },
    { name: 'Poêlée de légumes', calories: 200 },
    { name: 'Riz blanc (1 bol)', calories: 250 },
    { name: 'Purée de pommes de terre', calories: 200 },
    { name: 'Frites (portion moyenne)', calories: 400 },
    { name: 'Potatoes', calories: 350 }
];

// App Data
let appData = {
    setupComplete: false,
    profile: {
        gender: 'male',
        age: 30,
        height: 175,
        activityLevel: 'moderate',
        currentWeight: 75,
        targetWeight: 70,
        pace: 'moderate'
    },
    goals: {
        calories: 2000,
        waterGlasses: 8
    },
    today: {
        date: new Date().toDateString(),
        foods: [],
        water: 0,
        calories: 0
    },
    metrics: {
        weight: [],
        fatPercentage: [],
        caloriesBurned: [],
        steps: []
    },
    sleep: [],
    workouts: [],
    currentWorkout: [],
    streak: 0,
    lastActive: null,
    currentDish: null,
    currentPortion: 'medium',
    pendingPhoto: null
};

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
function calculateBMR() {
    const { gender, age, height, currentWeight } = appData.profile;
    
    if (gender === 'male') {
        return (10 * currentWeight) + (6.25 * height) - (5 * age) + 5;
    } else {
        return (10 * currentWeight) + (6.25 * height) - (5 * age) - 161;
    }
}

// Calculate TDEE (Total Daily Energy Expenditure)
function calculateTDEE() {
    const bmr = calculateBMR();
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        extra: 1.9
    };
    
    return Math.round(bmr * activityMultipliers[appData.profile.activityLevel]);
}

// Calculate daily calorie goal based on weight loss pace
function calculateCalorieGoal() {
    const tdee = calculateTDEE();
    const deficits = {
        slow: 250,    // -0.25kg/week
        moderate: 500, // -0.5kg/week
        fast: 750     // -0.75kg/week
    };
    
    const deficit = deficits[appData.profile.pace];
    return Math.round(tdee - deficit);
}

// Calculate water goal based on weight (30-35ml per kg)
function calculateWaterGoal() {
    const { currentWeight } = appData.profile;
    const mlPerKg = 30;
    const totalMl = currentWeight * mlPerKg;
    return Math.ceil(totalMl / 250); // Convert to glasses (250ml each)
}

// Calculate BMI
function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
}

// Calculate muscle mass estimate
function calculateMuscleMass(weight, fatPercentage) {
    const fatMass = (weight * fatPercentage) / 100;
    return (weight - fatMass).toFixed(1);
}

// Update streak
function updateStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (appData.lastActive === yesterday) {
        // Continue streak
        if (appData.today.calories > 0 || appData.today.water > 0) {
            appData.streak++;
        }
    } else if (appData.lastActive !== today) {
        // Reset streak if more than 1 day gap
        appData.streak = 0;
    }
    
    appData.lastActive = today;
    document.getElementById('streak-count').textContent = appData.streak + ' jours';
}

// Setup wizard functions
function nextStep() {
    const gender = document.getElementById('setup-gender').value;
    const age = parseInt(document.getElementById('setup-age').value);
    const height = parseInt(document.getElementById('setup-height').value);
    const activity = document.getElementById('setup-activity').value;
    
    if (!age || !height) {
        showNotification('Veuillez remplir tous les champs');
        return;
    }
    
    appData.profile.gender = gender;
    appData.profile.age = age;
    appData.profile.height = height;
    appData.profile.activityLevel = activity;
    
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    
    // Listen for weight changes to show preview
    document.getElementById('setup-current-weight').addEventListener('input', updateSetupPreview);
    document.getElementById('setup-target-weight').addEventListener('input', updateSetupPreview);
    document.getElementById('setup-pace').addEventListener('input', updateSetupPreview);
}

function updateSetupPreview() {
    const currentWeight = parseFloat(document.getElementById('setup-current-weight').value);
    const targetWeight = parseFloat(document.getElementById('setup-target-weight').value);
    const pace = document.getElementById('setup-pace').value;
    
    if (currentWeight && targetWeight) {
        appData.profile.currentWeight = currentWeight;
        appData.profile.targetWeight = targetWeight;
        appData.profile.pace = pace;
        
        const tdee = calculateTDEE();
        const calorieGoal = calculateCalorieGoal();
        const waterGoal = calculateWaterGoal();
        const weightDiff = currentWeight - targetWeight;
        
        const paceWeeks = {
            slow: Math.ceil(weightDiff / 0.25),
            moderate: Math.ceil(weightDiff / 0.5),
            fast: Math.ceil(weightDiff / 0.75)
        };
        
        const weeks = paceWeeks[pace];
        const months = Math.ceil(weeks / 4);
        
        document.getElementById('summary-text').innerHTML = `
            <strong>Calories quotidiennes :</strong> ${calorieGoal} kcal<br>
            <strong>Hydratation :</strong> ${waterGoal} verres d'eau/jour<br>
            <strong>Objectif atteint dans :</strong> ~${months} mois (${weeks} semaines)<br>
            <strong>Métabolisme de base (TDEE) :</strong> ${tdee} kcal/jour
        `;
        document.getElementById('calculated-info').style.display = 'block';
    }
}

function completeSetup() {
    const currentWeight = parseFloat(document.getElementById('setup-current-weight').value);
    const targetWeight = parseFloat(document.getElementById('setup-target-weight').value);
    const pace = document.getElementById('setup-pace').value;
    
    if (!currentWeight || !targetWeight) {
        showNotification('Veuillez remplir tous les champs');
        return;
    }
    
    appData.profile.currentWeight = currentWeight;
    appData.profile.targetWeight = targetWeight;
    appData.profile.pace = pace;
    
    // Calculate goals
    appData.goals.calories = calculateCalorieGoal();
    appData.goals.waterGlasses = calculateWaterGoal();
    
    appData.setupComplete = true;
    
    // Show main app
    document.getElementById('setup').style.display = 'none';
    document.getElementById('main-nav').style.display = 'block';
    document.getElementById('dashboard').style.display = 'block';
    
    // Initialize water glasses with calculated goal
    initWaterGlasses();
    
    saveData();
    updateUI();
    
    showNotification('🎉 Configuration terminée ! Bienvenue sur FitTrack');
}

function resetSetup() {
    if (confirm('Êtes-vous sûr de vouloir modifier vos informations ? Vos données seront conservées.')) {
        document.getElementById('setup-gender').value = appData.profile.gender;
        document.getElementById('setup-age').value = appData.profile.age;
        document.getElementById('setup-height').value = appData.profile.height;
        document.getElementById('setup-activity').value = appData.profile.activityLevel;
        document.getElementById('setup-current-weight').value = appData.profile.currentWeight;
        document.getElementById('setup-target-weight').value = appData.profile.targetWeight;
        document.getElementById('setup-pace').value = appData.profile.pace;
        
        appData.setupComplete = false;
        document.getElementById('setup').style.display = 'block';
        document.getElementById('main-nav').style.display = 'none';
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('step1').classList.add('active');
        document.getElementById('step2').classList.remove('active');
    }
}

// Sync data function
function syncData() {
    const weight = parseFloat(document.getElementById('sync-weight').value);
    const fat = parseFloat(document.getElementById('sync-fat').value);
    const burned = parseInt(document.getElementById('sync-burned').value);
    const steps = parseInt(document.getElementById('sync-steps').value);
    
    const today = new Date().toDateString();
    
    if (weight) {
        appData.metrics.weight.push({ date: today, value: weight });
        appData.profile.currentWeight = weight;
    }
    
    if (fat) {
        appData.metrics.fatPercentage.push({ date: today, value: fat });
    }
    
    if (burned) {
        appData.metrics.caloriesBurned.push({ date: today, value: burned });
        // Adjust calorie goal if burned significantly more/less
        const tdee = calculateTDEE();
        const diff = burned - tdee;
        if (Math.abs(diff) > 300) {
            // Adjust goal slightly
            const adjustment = Math.round(diff * 0.3);
            appData.goals.calories = calculateCalorieGoal() + adjustment;
        }
    }
    
    if (steps) {
        appData.metrics.steps.push({ date: today, value: steps });
    }
    
    document.getElementById('last-sync').textContent = 'Synchronisé à ' + new Date().toLocaleTimeString();
    
    // Clear inputs
    document.getElementById('sync-weight').value = '';
    document.getElementById('sync-fat').value = '';
    document.getElementById('sync-burned').value = '';
    document.getElementById('sync-steps').value = '';
    
    saveData();
    updateMetrics();
    updateDashboard();
    showNotification('✅ Données synchronisées !');
}

// Update metrics display
function updateMetrics() {
    const latestWeight = appData.metrics.weight.length > 0 ? 
        appData.metrics.weight[appData.metrics.weight.length - 1].value : '-';
    
    const latestFat = appData.metrics.fatPercentage.length > 0 ? 
        appData.metrics.fatPercentage[appData.metrics.fatPercentage.length - 1].value : '-';
    
    const avgSteps = appData.metrics.steps.length > 0 ?
        Math.round(appData.metrics.steps.reduce((sum, d) => sum + d.value, 0) / appData.metrics.steps.length) : '-';
    
    const avgBurned = appData.metrics.caloriesBurned.length > 0 ?
        Math.round(appData.metrics.caloriesBurned.reduce((sum, d) => sum + d.value, 0) / appData.metrics.caloriesBurned.length) : '-';
    
    const bmi = latestWeight !== '-' ? calculateBMI(latestWeight, appData.profile.height) : '-';
    const muscle = (latestWeight !== '-' && latestFat !== '-') ? 
        calculateMuscleMass(latestWeight, latestFat) : '-';
    
    document.getElementById('metric-weight').textContent = latestWeight !== '-' ? latestWeight : '-';
    document.getElementById('metric-fat').textContent = latestFat !== '-' ? latestFat + '%' : '-';
    document.getElementById('metric-muscle').textContent = muscle !== '-' ? muscle : '-';
    document.getElementById('metric-bmi').textContent = bmi;
    document.getElementById('metric-steps').textContent = avgSteps !== '-' ? avgSteps.toLocaleString() : '-';
    document.getElementById('metric-burned').textContent = avgBurned !== '-' ? avgBurned : '-';
}

// Load/Save data
async function loadData() {
    try {
        const stored = await window.storage.get('fittrack-data');
        if (stored && stored.value) {
            const loaded = JSON.parse(stored.value);
            
            // Merge loaded data with defaults
            appData = { ...appData, ...loaded };
            
            // Check if new day
            if (appData.today.date !== new Date().toDateString()) {
                appData.today = {
                    date: new Date().toDateString(),
                    foods: [],
                    water: 0,
                    calories: 0
                };
            }
            
            // Show setup or main app
            if (appData.setupComplete) {
                document.getElementById('setup').style.display = 'none';
                document.getElementById('main-nav').style.display = 'block';
                document.getElementById('dashboard').style.display = 'block';
            }
            
            saveData();
        }
    } catch (error) {
        console.log('No previous data, starting fresh');
    }
    
    updateUI();
    displayDishes();
    updateStreak();
}

async function saveData() {
    try {
        await window.storage.set('fittrack-data', JSON.stringify(appData));
    } catch (error) {
        console.error('Error saving:', error);
    }
}

// Display dishes
function displayDishes() {
    const grid = document.getElementById('dishes-grid');
    grid.innerHTML = commonDishes.map(dish => `
        <div class="dish-card" onclick="selectDish('${dish.name.replace(/'/g, "\\'")}', ${dish.calories})">
            <div class="dish-info">
                <h4>${dish.name}</h4>
                <div class="dish-cals">${dish.calories} kcal (portion moyenne)</div>
            </div>
            <span style="color: var(--primary); font-size: 1.5rem;">➕</span>
        </div>
    `).join('');
}

function filterDishes() {
    const search = document.getElementById('dish-search').value.toLowerCase();
    const filtered = commonDishes.filter(d => d.name.toLowerCase().includes(search));
    const grid = document.getElementById('dishes-grid');
    grid.innerHTML = filtered.map(dish => `
        <div class="dish-card" onclick="selectDish('${dish.name.replace(/'/g, "\\'")}', ${dish.calories})">
            <div class="dish-info">
                <h4>${dish.name}</h4>
                <div class="dish-cals">${dish.calories} kcal (portion moyenne)</div>
            </div>
            <span style="color: var(--primary); font-size: 1.5rem;">➕</span>
        </div>
    `).join('');
}

function selectDish(name, calories) {
    appData.currentDish = { name, calories };
    document.getElementById('portion-dish-name').textContent = name;
    document.getElementById('small-cals').textContent = Math.round(calories * 0.7) + ' kcal';
    document.getElementById('medium-cals').textContent = calories + ' kcal';
    document.getElementById('large-cals').textContent = Math.round(calories * 1.3) + ' kcal';
    closeModal('dishes-modal');
    openModal('portion-modal');
}

function selectPortion(size) {
    document.querySelectorAll('.portion-btn').forEach(b => b.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    appData.currentPortion = size;
}

function addDishWithPortion() {
    const { name, calories } = appData.currentDish;
    let finalCalories = calories;
    
    if (appData.currentPortion === 'small') finalCalories = Math.round(calories * 0.7);
    if (appData.currentPortion === 'large') finalCalories = Math.round(calories * 1.3);

    const portionLabel = appData.currentPortion === 'small' ? 'Petite' : 
                       appData.currentPortion === 'large' ? 'Grande' : 'Moyenne';

    const food = { 
        name: `${name} (${portionLabel})`, 
        calories: finalCalories, 
        time: new Date().toLocaleTimeString(),
        photo: appData.pendingPhoto
    };
    
    appData.today.foods.push(food);
    appData.today.calories += finalCalories;

    saveData();
    updateFoodLog();
    updateDashboard();
    updatePhotoGallery();
    checkSuggestions();
    closeModal('portion-modal');
    appData.pendingPhoto = null;
    appData.currentPortion = 'medium';
    showNotification(`${name} ajouté !`);
}

function selectMealType(name, calories) {
    const food = { 
        name, 
        calories, 
        time: new Date().toLocaleTimeString(),
        photo: appData.pendingPhoto
    };
    appData.today.foods.push(food);
    appData.today.calories += calories;

    saveData();
    updateFoodLog();
    updateDashboard();
    updatePhotoGallery();
    checkSuggestions();
    closeModal('meal-types-modal');
    appData.pendingPhoto = null;
    showNotification(`${name} ajouté !`);
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        appData.pendingPhoto = e.target.result;
        showNotification('Photo enregistrée ! Sélectionne maintenant ton repas');
    };
    reader.readAsDataURL(file);
}

function updatePhotoGallery() {
    const gallery = document.getElementById('photo-gallery');
    const foodsWithPhotos = appData.today.foods.filter(f => f.photo);
    
    if (foodsWithPhotos.length === 0) {
        gallery.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Aucune photo aujourd\'hui</p>';
        return;
    }

    gallery.innerHTML = foodsWithPhotos.map((food) => `
        <img src="${food.photo}" class="gallery-photo" onclick="viewPhoto('${food.name.replace(/'/g, "\\'")}', '${food.photo}')" alt="${food.name}">
    `).join('');
}

function viewPhoto(name, photo) {
    document.getElementById('photo-viewer-title').textContent = name;
    document.getElementById('photo-viewer-img').src = photo;
    openModal('photo-viewer-modal');
}

// Water functions
function initWaterGlasses() {
    const container = document.getElementById('water-glasses');
    const goal = appData.goals.waterGlasses;
    container.innerHTML = '';
    
    for (let i = 0; i < goal; i++) {
        const glass = document.createElement('div');
        glass.className = 'water-glass';
        if (i < appData.today.water) {
            glass.classList.add('filled');
        }
        glass.onclick = () => toggleWater(i);
        container.appendChild(glass);
    }
}

function toggleWater(index) {
    if (index < appData.today.water) {
        appData.today.water = index;
    } else {
        appData.today.water = index + 1;
    }
    initWaterGlasses();
    updateDashboard();
    saveData();
}

function resetWater() {
    appData.today.water = 0;
    initWaterGlasses();
    updateDashboard();
    saveData();
}

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Quick add
function quickAddCalories() {
    const calories = parseInt(document.getElementById('quick-calories').value);
    if (!calories) return;

    const food = { name: 'Ajout rapide', calories, time: new Date().toLocaleTimeString() };
    appData.today.foods.push(food);
    appData.today.calories += calories;

    saveData();
    updateFoodLog();
    updateDashboard();
    checkSuggestions();
    closeModal('quick-add-modal');
    document.getElementById('quick-calories').value = '';
    showNotification(`${calories} kcal ajoutées !`);
}

function updateFoodLog() {
    const log = document.getElementById('food-log');
    const totalEl = document.getElementById('total-calories');
    
    if (appData.today.foods.length === 0) {
        log.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Aucun aliment ajouté aujourd\'hui</p>';
        totalEl.textContent = '0';
        return;
    }

    log.innerHTML = appData.today.foods.map((food, index) => `
        <div class="food-item">
            ${food.photo ? `<img src="${food.photo}" class="food-photo" onclick="viewPhoto('${food.name.replace(/'/g, "\\'")}', '${food.photo}')">` : ''}
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-calories">${food.calories} kcal • ${food.time}</div>
            </div>
            <button class="delete-btn" onclick="deleteFood(${index})">✕</button>
        </div>
    `).join('');

    totalEl.textContent = appData.today.calories;
}

function deleteFood(index) {
    appData.today.calories -= appData.today.foods[index].calories;
    appData.today.foods.splice(index, 1);
    saveData();
    updateFoodLog();
    updateDashboard();
    updatePhotoGallery();
    checkSuggestions();
}

// Barcode scanner
async function searchBarcode() {
    const barcode = document.getElementById('barcode-input').value;
    if (!barcode) return;

    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();

        if (data.status === 1) {
            const product = data.product;
            const name = product.product_name || 'Produit inconnu';
            const calories = product.nutriments['energy-kcal_100g'] || 0;

            document.getElementById('barcode-result').innerHTML = `
                <div class="card" style="margin-top: 1rem;">
                    <h3>${name}</h3>
                    <p><strong>${Math.round(calories)} kcal</strong> pour 100g</p>
                    <div class="form-group">
                        <label>Quantité (g)</label>
                        <input type="number" id="product-quantity" value="100">
                    </div>
                    <button class="btn btn-primary" style="width: 100%;" onclick="addScannedProduct('${name.replace(/'/g, "\\'")}', ${calories})">Ajouter</button>
                </div>
            `;
            document.getElementById('barcode-result').style.display = 'block';
        } else {
            showNotification('Produit non trouvé');
        }
    } catch (error) {
        showNotification('Erreur lors de la recherche');
    }
}

function addScannedProduct(name, caloriesPer100g) {
    const quantity = parseFloat(document.getElementById('product-quantity').value) || 100;
    const calories = Math.round((caloriesPer100g * quantity) / 100);

    const food = { name: `${name} (${quantity}g)`, calories, time: new Date().toLocaleTimeString() };
    appData.today.foods.push(food);
    appData.today.calories += calories;

    saveData();
    updateFoodLog();
    updateDashboard();
    checkSuggestions();
    closeModal('barcode-modal');
    document.getElementById('barcode-input').value = '';
    document.getElementById('barcode-result').style.display = 'none';
    showNotification(`${name} ajouté !`);
}

// Sleep
let selectedQuality = null;

function selectQuality(btn) {
    document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedQuality = btn.dataset.quality;
}

function logSleep() {
    const bedtime = document.getElementById('sleep-bedtime').value;
    const waketime = document.getElementById('sleep-waketime').value;

    if (!bedtime || !waketime || !selectedQuality) {
        showNotification('Veuillez remplir tous les champs');
        return;
    }

    const bed = new Date(`2000-01-01T${bedtime}`);
    let wake = new Date(`2000-01-01T${waketime}`);
    
    if (wake < bed) {
        wake = new Date(`2000-01-02T${waketime}`);
    }

    const duration = (wake - bed) / (1000 * 60 * 60);

    const sleepLog = {
        date: new Date().toLocaleDateString(),
        bedtime,
        waketime,
        duration: duration.toFixed(1),
        quality: selectedQuality
    };

    appData.sleep.unshift(sleepLog);
    saveData();
    updateSleepHistory();
    updateDashboard();

    document.getElementById('sleep-bedtime').value = '';
    document.getElementById('sleep-waketime').value = '';
    document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('selected'));
    selectedQuality = null;

    showNotification('Sommeil enregistré !');
}

function updateSleepHistory() {
    const history = document.getElementById('sleep-history');
    if (appData.sleep.length === 0) {
        history.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Aucun sommeil enregistré</p>';
        return;
    }

    history.innerHTML = appData.sleep.slice(0, 7).map(sleep => `
        <div class="food-item">
            <div class="food-info">
                <div class="food-name">${sleep.date}</div>
                <div class="food-calories">${sleep.duration}h • ${sleep.quality} • ${sleep.bedtime} → ${sleep.waketime}</div>
            </div>
        </div>
    `).join('');
}

// Workout
function addExercise() {
    const name = document.getElementById('exercise-name').value;
    const sets = parseInt(document.getElementById('exercise-sets').value);
    const reps = parseInt(document.getElementById('exercise-reps').value);
    const weight = parseFloat(document.getElementById('exercise-weight').value) || 0;

    if (!name || !sets || !reps) {
        showNotification('Veuillez remplir tous les champs obligatoires');
        return;
    }

    const exercise = { name, sets, reps, weight };
    appData.currentWorkout.push(exercise);

    updateCurrentWorkout();
    closeModal('add-exercise-modal');

    document.getElementById('exercise-name').value = '';
    document.getElementById('exercise-sets').value = '3';
    document.getElementById('exercise-reps').value = '10';
    document.getElementById('exercise-weight').value = '';
}

function updateCurrentWorkout() {
    const container = document.getElementById('current-workout');
    const saveBtn = document.getElementById('save-workout-btn');

    if (appData.currentWorkout.length === 0) {
        container.innerHTML = '';
        saveBtn.disabled = true;
        return;
    }

    saveBtn.disabled = false;
    container.innerHTML = appData.currentWorkout.map((ex, index) => `
        <div class="exercise-item">
            <div class="exercise-header">
                <span class="exercise-name">${ex.name}</span>
                <button class="delete-btn btn-small" onclick="deleteExercise(${index})">✕</button>
            </div>
            <div class="sets-info">
                <span>${ex.sets} séries</span>
                <span>${ex.reps} reps</span>
                ${ex.weight ? `<span>${ex.weight} kg</span>` : ''}
            </div>
        </div>
    `).join('');
}

function deleteExercise(index) {
    appData.currentWorkout.splice(index, 1);
    updateCurrentWorkout();
}

function saveWorkout() {
    const type = document.getElementById('workout-type').value;
    
    const workout = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        type,
        exercises: [...appData.currentWorkout]
    };

    appData.workouts.unshift(workout);
    appData.currentWorkout = [];

    saveData();
    updateCurrentWorkout();
    updateWorkoutHistory();
    showNotification('Séance enregistrée ! 💪');
}

function updateWorkoutHistory() {
    const history = document.getElementById('workout-history');
    if (appData.workouts.length === 0) {
        history.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Aucun entraînement enregistré</p>';
        return;
    }

    history.innerHTML = appData.workouts.slice(0, 10).map(workout => `
        <div class="card" style="margin-bottom: 1rem;">
            <div class="card-header">
                <h3 class="card-title">${workout.type}</h3>
                <span style="color: var(--text-secondary);">${workout.date}</span>
            </div>
            ${workout.exercises.map(ex => `
                <div class="exercise-item" style="margin-bottom: 0.5rem;">
                    <div class="exercise-name">${ex.name}</div>
                    <div class="sets-info">
                        <span>${ex.sets} × ${ex.reps}</span>
                        ${ex.weight ? `<span>${ex.weight} kg</span>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// Smart suggestions
function checkSuggestions() {
    const remaining = appData.goals.calories - appData.today.calories;
    const suggestionCard = document.getElementById('suggestion-card');
    const suggestionText = document.getElementById('suggestion-text');
    
    if (remaining <= 0) {
        suggestionCard.style.display = 'block';
        suggestionText.textContent = '🎉 Objectif calorique atteint ! Bravo !';
    } else if (remaining < 300) {
        suggestionCard.style.display = 'block';
        suggestionText.textContent = `Plus que ${remaining} kcal aujourd'hui. Un petit snack ou un repas léger fera l'affaire !`;
    } else if (remaining > 1000) {
        suggestionCard.style.display = 'block';
        suggestionText.textContent = `Il te reste ${remaining} kcal. N'oublie pas de bien manger pour maintenir ton énergie !`;
    } else {
        suggestionCard.style.display = 'none';
    }
}

// Dashboard update
function updateDashboard() {
    document.getElementById('today-calories').textContent = appData.today.calories;
    document.getElementById('calorie-goal-display').textContent = appData.goals.calories;
    
    const calorieProgress = (appData.today.calories / appData.goals.calories) * 100;
    document.getElementById('calorie-progress').style.width = Math.min(calorieProgress, 100) + '%';
    
    const remaining = appData.goals.calories - appData.today.calories;
    const remainingEl = document.getElementById('calories-remaining');
    if (remaining > 0) {
        remainingEl.textContent = `Reste ${remaining} kcal`;
        remainingEl.style.opacity = '0.8';
    } else {
        remainingEl.textContent = 'Objectif atteint ! 🎉';
        remainingEl.style.opacity = '1';
    }

    document.getElementById('today-water').textContent = appData.today.water;
    document.getElementById('water-count').textContent = appData.today.water;
    document.getElementById('water-goal').textContent = appData.goals.waterGlasses;
    document.getElementById('water-goal-display').textContent = appData.goals.waterGlasses;
    const waterProgress = (appData.today.water / appData.goals.waterGlasses) * 100;
    document.getElementById('water-progress').style.width = waterProgress + '%';

    if (appData.sleep.length > 0) {
        document.getElementById('last-sleep').textContent = appData.sleep[0].duration;
    }

    document.getElementById('current-weight-display').textContent = appData.profile.currentWeight;
    document.getElementById('weight-goal-display').textContent = appData.profile.targetWeight;
}

// Update UI
function updateUI() {
    updateDashboard();
    initWaterGlasses();
    updateFoodLog();
    updateSleepHistory();
    updateWorkoutHistory();
    updatePhotoGallery();
    updateMetrics();
    checkSuggestions();
}

// Notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    document.getElementById('notification-text').textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Auto-activate water reminders on load
setTimeout(() => {
    if (appData.setupComplete) {
        setInterval(() => {
            if (appData.today.water < appData.goals.waterGlasses) {
                showNotification('💧 N\'oublie pas de boire de l\'eau !');
            }
        }, 60 * 60 * 1000); // Every hour
    }
}, 5000);

// Initialize
loadData();
