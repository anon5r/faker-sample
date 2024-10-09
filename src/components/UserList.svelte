<script lang="ts">
  import { faker as baseFaker, fakerEN, fakerEN_US, fakerEN_GB, fakerFR, fakerDE, fakerIT, fakerPT_BR, fakerRU, fakerJA, fakerZH_CN, fakerZH_TW, fakerKO } from '@faker-js/faker';
  import { onMount } from 'svelte';

  type User = {
    backgroundImage: string;
    avatar: string;
    fullName: string;
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
  let selectedCountry: string = 'RAND';

  const countryFakers = {
    RAND: baseFaker,
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

  const countries = {
    RAND: 'Random',
    US: 'USA',
    GB: 'British',
    FR: 'French',
    GE: 'German',
    IT: 'Italy',
    PT_BR: 'Brazil',
    RU: 'Russian',
    ZH_CN: 'Chinese (Mainland)',
    ZH_TW: 'Taiwanese',
    JA: 'Japanese',
    KO: 'Korean',
  };

  const countriesWithMiddleName = ['US', 'GB', 'FR', 'IT', 'PT_BR', 'GE']; // ミドルネームを表示する国

  function generateUsers(countryCode: string = 'RAND') {
    users = [];
    const faker = countryFakers[countryCode];

    for (let i = 0; i < 20; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      // ミドルネームの条件分岐
      const middleName = countriesWithMiddleName.includes(countryCode) ? faker.person.middleName() : '';
      const fullName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;

      users.push({
        backgroundImage: faker.image.url({ width: 640, height: 480 }),
        avatar: faker.image.avatar(),
        fullName: fullName,
        handle: faker.internet.displayName(),
        username: faker.internet.userName({ firstName: firstName, lastName: lastName }),
        gender: faker.person.sexType(),
        birthday: faker.date.birthdate({ mode: 'age', min: 18, max: 65 }).toISOString().slice(0, 10),
        email: faker.internet.email(),
        companyEmail: `${faker.internet.userName({ firstName: firstName, lastName: lastName })}@${faker.internet.domainName()}`,
        phone: faker.phone.number(),
        address: faker.location.streetAddress() + ', ' + faker.location.city(),
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
</script>

<!-- UI部分 -->
<main>
  <div>
    <label for="country">国でフィルター:</label>
    <select id="country" bind:value={selectedCountry} on:change={onCountryChange}>
      {#each Object.keys(countries) as countryKey}
        <option value={countryKey}>{countries[countryKey]}</option>
      {/each}
    </select>
  </div>

  <div class="user-list">
    {#each users as user}
      <div class="user-card" style="background-image: url({user.backgroundImage});">
        <img src={user.avatar} alt="Avatar" class="avatar" />
        <div class="user-info">
          <h3>{user.fullName}</h3>
          <p>@{user.handle}</p>
          <p>性別: {user.gender}</p>
          <p>誕生日: {user.birthday}</p>
          <p>Email: {user.email}</p>
          <p>Work email: {user.companyEmail}</p>
          <p>電話番号: {user.phone}</p>
          <p>住所: {user.address}</p>
          <p>国: {user.country}</p>
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  .user-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .user-card {
    background-size: cover;
    padding: 1rem;
    color: white;
    position: relative;
  }

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .user-info {
    margin-top: 60px;
  }
</style>