/**
 * Shared project data for index grid + project detail pages.
 * overviewParagraphs may include <strong>...</strong> for emphasis.
 */
window.PORTFOLIO_PROJECTS = [
  {
    slug: 'internship-simplifi',
    title: 'Internship at Simplifi',
    tags: ['Networking', 'Telecoms', 'Internship'],
    image: ['images/simplifi_networks_cover.jpg'],
    imageAlt: 'Simplifi Logo',
    overviewParagraphs: [
      'This technical internship in <strong> Kampala, Uganda</strong> focused on the deployment and configuration of <strong>telecoms networking equipment</strong> across real infrastructure. I worked hands-on with <strong>Ruijie</strong>, <strong>Ubiquiti</strong>, and <strong>MikroTik</strong> hardware, configuring devices from the ground up.',
      'The core of the work was building a deep understanding of how network topologies are structured — how traffic is routed, how devices gain internet access, how separate networks communicate with each other, and how security is enforced at the different access layers.',
    ],
    highlights: [
      'Configured VLANs and subnetting across multi-device network deployments',
      'Set up RADIUS servers for 802.1X network access control',
      'Gained end-to-end understanding of how enterprise network topologies route and segment traffic',
    ],
    technologies: [
      'Ruijie',
      'Ubiquiti',
      'MikroTik',
      'VLANs',
      'RADIUS',
      '802.1X',
      'SSH',
      'Subnetting',
    ],
    year: '2026 - 3 Month Length',
    githubUrl: 'none',
  },
  {
    slug: 'ubiquiti-network',
    title: 'Ubiquiti Model Network',
    tags: ['Networking', 'Telecoms', 'Ubiquiti'],
    image: ['images/IMG_1079.jpg', 'images/IMG_1080.jpg'],
    imageAlt: 'Network Wiring',
    overviewParagraphs: [
      'This internship projects focused on using <strong>Ubiquiti</strong> products to properly design and organize a network based off of a theoretical <strong>customers constraints</strong>. This included implementing multiple SSIDs that separated Staff, Admin, and Guests on different VLANs for security/QoS purposes, adding cameras and intercom systems, and being willing to change based on customer desires.',
      'Final product included 2 SSIDs that split users into 2 separate VLANs + 1 Admin VLAN, then based off of VLAN assignment different users were allotted different data rates allowing for optimal usage for staff and admin. The authentication system for the guest users used pre generated codes that would allow a user with one of these codes to connect up to 3 concurrent devices with an unlimited amount of data but a data rate of ~3mb/s.',
      'The subnets and VLANs allow for users withing a certain VLAN to communicate between each-other allowing for easy file sharing and communication while still limiting communication outside of their "sector", not only does this prevent internal data stealing but also limits the spread of network based viruses.',
    ],
    highlights: [
      'Organization of a high quality, secure network topology',
      'Constructed within "client" constraints',
      'Demonstrated perseverance and problem solving skills',
    ],
    technologies: [
      'Ubiquiti',
      'Routers/Switches/APs',
      'SSH',
      'Ethernet',
      'VLANs',
    ],
    year: '2026',
    githubUrl: 'none',
  },
  {
    slug: 'kibale-weather-station',
    title: 'Kibale Weather Stations',
    tags: ['Data Collection', 'Sensor Implementation'],
    image: [
      'images/IMG_1142.jpg',
      'images/IMG_1140.jpg',
      'images/IMG_1134.jpg',
      'images/IMG_1147.jpg',
      'images/IMG_1155.jpg',
    ],
    imageAlt: 'Weather Data',
    overviewParagraphs: [
      'In Kibale National Park in Uganda, <strong>Makarere University Biological Field Station</strong> (MUBFS), in ' +
        'collaboration with Carlton University, houses 6 weather stations using Dragino sensors to record <strong>air temp, soil PH, and ' +
        'rainfall levels.</strong> I was sent out to maintain the Mikrotik gateways and the omnidirectional antennas, and make sure that all the sensor data is properly stored and sent.',
      'This included configuring the sensors to properly communicate with the central MikroTik LtAP gateway, aligning antennas, replacing SIM cards, and verifying that all sensor data was being received and transmitted',
    ],
    highlights: [
      'Multi-Sensor Data Consolidation',
      'Sensor Setup and Debugging',
      'Gateway and Antenna Configuration',
    ],
    technologies: [
      'MikroTik',
      'Dragino Soil PH Sensors',
      'Dragino Rainfall Sensors',
      'Dragino Air Temp Sensors',
      'Omnidirectional Outdoor Antennas',
    ],
    year: '2026',
    githubUrl: 'none',
  },
  {
    slug: 'ruijie-network',
    title: 'Ruijie Model Network',
    tags: ['Networking', 'Telecoms', 'Ruijie'],
    image: [
      'images/IMG_1052.jpg',
      'images/IMG_1050.jpg',
      'images/IMG_1051.jpg',
      'images/IMG_1063.jpg',
    ],
    imageAlt: 'Rujie Topology',
    overviewParagraphs: [
      'Using <strong>Ruijie</strong> hardware and cloud software allowed for very basic configuration of a network. This included <strong>multiple SSIDs</strong> that separated Staff, Admin, and Guests on different VLANs for security, there was also the implementation of <strong>data limits</strong> and speed limits for different users.',
      'There was also the use of vouchers and a redirect to a portal to allow for limitation of guests using the network, these limitations included; No access to the configuration portal, low data speed limits, and no more than 1 concurrent device.',
    ],
    highlights: [
      'Network Configuration',
      'Data Speed Limitations',
      'Secure Subnets by Utilization of VLANs',
    ],
    technologies: ['Ruijie', 'Cloud Software', 'Ethernet'],
    year: '2026',
    githubUrl: 'none',
  },
];
