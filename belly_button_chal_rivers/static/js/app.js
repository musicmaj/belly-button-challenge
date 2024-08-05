// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field and filter by the sample number
    let metadata = data.metadata.filter(x => x.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let key in metadata) {
      panel.append("h6").text(`${key}: ${metadata[key]}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples_field = data.samples;

    // Filter the samples for the object with the desired sample number
    let filtered = samples_field.filter(x => x.id === sample)[0];
    console.log(filtered);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filtered.otu_ids;
    let otu_labels = filtered.otu_labels;
    let sample_values = filtered.sample_values;

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_y = otu_ids.map(x => `OTU: ${x}`);
    console.log(bar_y);
  
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar1 = {
      x: sample_values.slice(0, 10).reverse(),
      y: bar_y.slice(0, 10).reverse(),
      type: 'bar',
      marker: {
        colorscale: "Picnic",
        color: sample_values.slice(0, 10).reverse()
      },
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    };
  
  
    // Render the Bar Chart
    let bar = [bar1];
  
     // Apply a title to the layout
    let layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {
        title: {
          text: 'Number of Bacteria'
        }
      },
      yaxis: {
        title: {
          text: 'OTU ID'
        }
      }
    };

    var config = {responsive: true}
  
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", bar, layout, config);
  
  
    // Build a Bubble Chart
    let bubble_info = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Picnic"
      },
      text: otu_labels
      };

    let bubble_traces = [bubble_info];

    // Render the Bubble Chart
    let bubble_layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {
        title: {
          text: 'OTU ID'
        }
      },
      yaxis: {
        title: {
          text: 'Number of Bacteria'
        }
      }
    };
    var config = {responsive: true}
    
    Plotly.newPlot('bubble', bubble_traces, bubble_layout, config);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field, dropdown with id, and sample list
    // I worked through this code with my tutor Anna Poulakos
console.log(data.names)
    let select = document.getElementById('selDataset');
    for (let name of data.names) {
      let opt = document.createElement('option');
      opt.value = name;
      opt.innerText = name;
      select.appendChild(opt);
    }

    // Get the first sample from the list
    let first_name = data.names[0]

    // Build charts and metadata panel with the first sample
    buildMetadata(first_name);
    buildCharts(first_name);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
