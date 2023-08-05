const axios = require('axios');

const data = require('./package.json');

  // Extracting dependencies and devDependencies
  const dependencies = data.dependencies;
  const devDependencies = data.devDependencies;
  
  // Combining both dependencies and devDependencies
  const allDependencies = { ...dependencies, ...devDependencies };
  
  // Function to fetch latest versions and licenses
  async function getLatestVersionsAndLicenses(dependencies) {
    const latestVersionsAndLicenses = {};
  
    try {
      const packageNames = Object.keys(dependencies);
      const responses = await axios.all(
        packageNames.map((packageName) =>
          axios.get(`https://registry.npmjs.org/${packageName}/latest`)
        )
      );
  
      for (let i = 0; i < responses.length; i++) {
        const packageName = packageNames[i];
        const response = responses[i];
        const { version, license } = response.data;
        latestVersionsAndLicenses[packageName] = {
          currentVersion: dependencies[packageName],
          latestVersion: version,
          license,
        };
      }
    } catch (error) {
      console.error('Error occurred while fetching latest versions and licenses:', error);
      // Fallback to use the existing version and license from the data object
      for (const packageName in dependencies) {
        latestVersionsAndLicenses[packageName] = {
          currentVersion: dependencies[packageName],
          latestVersion: dependencies[packageName], // Fallback to current version
          license: devDependencies[packageName] || '',
        };
      }
    }
  
    return latestVersionsAndLicenses;
  }
  
  // Fetch latest versions and licenses and assign it to a variable
  const latestVersionsAndLicensesPromise = getLatestVersionsAndLicenses(allDependencies);
  
  // Convert the object to CSV format and log it
  latestVersionsAndLicensesPromise.then((latestVersionsAndLicenses) => {
    let csvData = 'Package Name,Current Version,Latest Version,License\n';
    for (const packageName in latestVersionsAndLicenses) {
      const { currentVersion, latestVersion, license } = latestVersionsAndLicenses[packageName];
      csvData += `${packageName},${currentVersion},${latestVersion},${license}\n`;
    }
    console.log(csvData);
  }).catch((error) => {
    console.error('Error occurred while fetching latest versions and licenses:', error);
  });
  