const axios = require('axios');
const data = require('./package.json');

// Extracting all dependencies and devDependencies
const allDependencies = { ...data.dependencies, ...data.devDependencies };

// Function to fetch latest versions or licenses
async function fetchLatestInfo() {
  const latestInfo = [];
  let csvData = 'Package Name,Current Version,Latest Version,License\n';

  for (const packageName in allDependencies) {
    try {
      const response = await axios.get(`https://registry.npmjs.org/${packageName}/latest`);
      const packageInfo = {
        package: packageName,
        license: response.data.license,
        'latest-version': response.data.version,
        'current-version': allDependencies[packageName],
      };
      latestInfo.push(packageInfo);
      csvData += `${packageName},${allDependencies[packageName]},${response.data.version},${response.data.license}\n`;
    } catch (error) {
      console.error(`Failed to fetch latest version or license for package: ${packageName}`);
      const packageInfo = {
        package: packageName,
        license: allDependencies[packageName],
        'latest-version': allDependencies[packageName], // Use the existing version or license as fallback
        'current-version': allDependencies[packageName],
      };
      latestInfo.push(packageInfo);
      csvData += `${packageName},${allDependencies[packageName]},${allDependencies[packageName]},${allDependencies[packageName]}\n`;
    }
  }

  return csvData;
}

// Fetch latest versions and licenses
fetchLatestInfo()
  .then((csvData) => {
    console.log(csvData);
  })
  .catch((error) => {
    console.error('Error occurred while fetching latest info:', error);
  });
