<script lang="ts">
  import { faker as fakerEN_US } from '@faker-js/faker/locale/en_US'
  import { faker as fakerEN_GB } from '@faker-js/faker/locale/en_GB'
  import { faker as fakerDE } from '@faker-js/faker/locale/de'
  import { faker as fakerFR } from '@faker-js/faker/locale/fr'
  import { faker as fakerIT } from '@faker-js/faker/locale/it'
  import { faker as fakerPT_BR } from '@faker-js/faker/locale/pt_BR'
  import { faker as fakerRU } from '@faker-js/faker/locale/ru'
  import { faker as fakerJA } from '@faker-js/faker/locale/ja'
  import { faker as fakerKO } from '@faker-js/faker/locale/ko'
  import { faker as fakerZH_CN } from '@faker-js/faker/locale/zh_CN'
  import { faker as fakerZH_TW } from '@faker-js/faker/locale/zh_TW'
  import { onMount } from 'svelte';
  
  type FakerInstance = typeof fakerEN_US;
  
  type User = {
    backgroundImage: string;
    avatar: string;
    fullName: string;
    firstName: string;
    lastName: string;
    middleName: string;
    handle: string;
    username: string;
    gender: string;
    birthday: string;
    email: string;
    companyEmail: string;
    phone: string;
    address: string;
    country: string;
  };

  let users: User[] = [];
  let selectedCountry: string = 'US';
  let includeMiddleName = false;
  let isCJK = false;

  const countryFakers :{ [key: string]: FakerInstance }  = {
    US: fakerEN_US,
    GB: fakerEN_GB,
    FR: fakerFR,
    GE: fakerDE,
    IT: fakerIT,
    PT_BR: fakerPT_BR,
    RU: fakerRU,
    JA: fakerJA,
    ZH_CN: fakerZH_CN,
    ZH_TW: fakerZH_TW,
    KO: fakerKO,
  };

  const countries :{ [key: string]: string }  = {
    RAND: 'English',
    US: 'American',
    GB: 'British',
    FR: 'French',
    GE: 'German',
    IT: 'Italian',
    PT_BR: 'Brazilian',
    RU: 'Russian',
    ZH_CN: 'Chinese (Mainland)',
    ZH_TW: 'Chinese (Taiwan)',
    JA: 'Japanese',
    KO: 'Korean',
  };

  const countriesWithMiddleName = ['US', 'GB', 'FR', 'IT', 'PT_BR', 'GE']; // Use middle-name

  function generateUsers(countryCode: string = 'US') {
    users = [];
    const faker = countryFakers[countryCode];
    isCJK = ['JA', 'ZH_CN', 'ZH_TW', 'KO'].includes(countryCode);

    for (let i = 0; i < 30; i++) {
      const sexType = faker.person.sexType()
      const firstName = faker.person.firstName(sexType);
      const lastName = faker.person.lastName(sexType);
      // Middle-name
      const middleName = countriesWithMiddleName.includes(countryCode)
              ? faker.person.middleName(sexType) : '';
      
      users.push({
        backgroundImage: faker.image.urlPicsumPhotos({ width: 640, height: 480, blur: 4 }),
        avatar: faker.image.avatar(),
        fullName: faker.person.fullName({sex: sexType}),
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        handle: faker.internet.displayName({ firstName: firstName, lastName: lastName }),
        username: faker.internet.userName({ firstName: firstName, lastName: lastName }),
        gender: sexType,
        birthday: faker.date.birthdate({ mode: 'age', min: 13, max: 70 }).toISOString().slice(0, 10),
        email: faker.internet.email(),
        companyEmail: faker.internet.email({ firstName: firstName, lastName: lastName, provider: faker.internet.domainName() }),
        phone: faker.phone.number({style: 'international'}),
        address:
                isCJK
                  ? faker.location.state() + faker.location.city() + faker.location.streetAddress({useFullAddress: true})
                  : faker.location.streetAddress() + ', ' + faker.location.city() + ', ' + faker.location.state(),
        country: faker.location.country(),
      });
    }
  }

  onMount(() => {
    generateUsers();
  });

  function onCountryChange(event: Event) {
    const selected = (event.target as HTMLSelectElement).value;
    selectedCountry = selected;
    generateUsers(selected);
  }
  
  function onChangeMiddleName(event: Event) {
    includeMiddleName = !includeMiddleName;
  }
  
</script>

<!-- UI部分 -->
<main class="p-4 bg-gray-100">
  <div class="mb-4">
    <div class="flex items-center mb-2">
      <label for="includeMiddleName" class="mr-2 text-gray-700">Include Middle Name</label>
      <input type="checkbox" id="includeMiddleName" on:click={onChangeMiddleName} bind:checked={includeMiddleName} class="form-checkbox h-4 w-4 text-blue-600"/>
    </div>
    <label for="country" class="block text-gray-700 mb-1">Filter by country:</label>
    <select id="country" bind:value={selectedCountry} on:change={onCountryChange} class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
      {#each Object.keys(countries) as countryKey}
        <option value={countryKey}>{countries[countryKey]}</option>
      {/each}
    </select>
  </div>
  
  <div class="user-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each users as user}
      <div class="card bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="card__image h-40 bg-cover bg-center relative" style="background-image: url({user.backgroundImage});">
          <img src="{user.avatar}" alt="{user.firstName} {includeMiddleName ? user.middleName : ''} {user.lastName}" class="avatar w-64 h-64 rounded-full border-4 border-white"/>
        </div>
        <div class="card__body p-4 text-left">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            {#if isCJK}
              {user.lastName} {user.firstName}
            {:else}
              {user.firstName} {includeMiddleName ? user.middleName : ''} {user.lastName}
            {/if}
          </h3>
          <p class="text-gray-700"><i class="fa-solid fa-at text-blue-500 mr-2"></i>{user.handle}</p>
          <p class="text-gray-700"><i class="fa-solid fa-person-half-dress text-pink-500 mr-2"></i>{user.gender}</p>
          <p class="text-gray-700"><i class="fa-regular fa-calendar-days text-yellow-500 mr-2"></i>{user.birthday}</p>
          <p class="text-gray-700"><i class="fa-regular fa-paper-plane text-green-500 mr-2"></i>{user.email}</p>
          <p class="text-gray-700"><i class="fa-regular fa-envelope text-blue-500 mr-2"></i>{user.companyEmail}</p>
          <p class="text-gray-700"><i class="fa-solid fa-phone text-blue-500 mr-2"></i>{user.phone}</p>
          <p class="text-gray-700"><i class="fa-solid fa-map-marker-alt text-red-500 mr-2"></i>{user.address}</p>
        </div>
      </div>
    {/each}
  </div>
</main>

<style>

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .card {
    font-family: sans-serif;
    border-radius: 4px;
    box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    position: relative;
  }
  
  .card__body {
    padding: 10px 8px 16px;
    min-height: 160px;
    text-align: left;
    
  }
  
  .card__image {
    position: relative;
    border-bottom: 1px solid #888888;
    background-size: cover;
    padding-bottom: 40%;
    color: white;
  }
  
  .avatar {
    width: 96px; /* 24を指定 */
    height: 96px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 4px solid white;
    object-fit: cover;
  }
</style>