import { parseString } from 'react-native-xml2js';

export const parseXML = (xml) => {
  return new Promise((resolve, reject) => {
    // Clean up the XML string
    const cleanXml = xml.replace(/^(?:export default)?[`']?\n?/, '')
                       .replace(/[`']?;?\n*$/, '');

    console.log('Parsing XML:', cleanXml.substring(0, 100) + '...');

    parseString(cleanXml, { explicitArray: true }, (err, result) => {
      if (err) {
        console.error('XML Parse Error:', err);
        reject(new Error('Invalid XML format: ' + err.message));
        return;
      }
      
      try {
        console.log('Initial parse result:', JSON.stringify(result, null, 2).substring(0, 200) + '...');

        // Get the root div's children
        const rootDivChildren = result?.div?.div;
        if (!rootDivChildren || !Array.isArray(rootDivChildren)) {
          throw new Error('Invalid root structure');
        }

        // Find formSide div
        const formSideDiv = rootDivChildren.find(div => 
          div?.$?.class === 'formSide' && div?.$?.id === 'formSide1'
        );

        if (!formSideDiv) {
          console.error('Available divs:', rootDivChildren.map(d => d?.$));
          throw new Error('No formSide div found');
        }

        // Process form elements
        const fields = [];
        const processedGroups = new Set();

        // Find all groups that contain form elements
        const processGroups = (element) => {
          if (!element) return;

          // If this is a group with fdtType, process it
          if (element.$ && element.$.fdtType) {
            const type = element.$.fdtType;
            const fieldName = element.$.fdtFieldName;

            if (fieldName && !processedGroups.has(fieldName)) {
              const label = findLabel(formSideDiv, fieldName);

              switch (type) {
                case 'iso':
                  if (element.$.fdtFormat?.includes('Alpha')) {
                    fields.push({
                      type: 'text',
                      label: label || fieldName,
                      name: fieldName,
                      length: countRectElements(element),
                    });
                  } else if (element.$.fdtFormat?.includes('DD/MM/YYYY')) {
                    fields.push({
                      type: 'date',
                      label: label || 'Date',
                      name: fieldName,
                    });
                  }
                  break;

                case 'radioList':
                  const groupName = element.$.fdtGroupName;
                  const existingRadio = fields.find(f => f.name === groupName);
                  const radioLabel = findRadioLabel(formSideDiv, element.$.fdtTicked);

                  if (existingRadio) {
                    existingRadio.options.push({
                      label: radioLabel || element.$.fdtTicked,
                      value: element.$.fdtTicked,
                    });
                  } else {
                    fields.push({
                      type: 'radio',
                      label: groupName || 'Stages',
                      name: groupName || 'Stages',
                      options: [{
                        label: radioLabel || element.$.fdtTicked,
                        value: element.$.fdtTicked,
                      }],
                    });
                  }
                  break;

                case 'cursiveSignature':
                  fields.push({
                    type: 'drawing',
                    label: label || 'Signature',
                    name: fieldName,
                  });
                  break;
              }

              processedGroups.add(fieldName);
            }
          }

          // Process child elements
          Object.keys(element).forEach(key => {
            if (Array.isArray(element[key])) {
              element[key].forEach(child => {
                if (child && typeof child === 'object') {
                  processGroups(child);
                }
              });
            } else if (element[key] && typeof element[key] === 'object') {
              processGroups(element[key]);
            }
          });
        };

        // Start processing from the formSide div
        processGroups(formSideDiv);

        console.log('Found fields:', fields);
        resolve(fields);
      } catch (e) {
        console.error('Field Processing Error:', e);
        reject(new Error('Error extracting fields from XML: ' + e.message));
      }
    });
  });
};

const findLabel = (root, fieldName) => {
  const labels = [];
  
  const findLabelsInElement = (element) => {
    if (!element) return;

    // Check if this is a label element
    if (element.$ && 
        element.$.fdtType === 'label' && 
        element._ &&
        typeof element._ === 'string') {
      labels.push(element);
    }

    // Check children
    Object.keys(element).forEach(key => {
      if (Array.isArray(element[key])) {
        element[key].forEach(child => {
          if (child && typeof child === 'object') {
            findLabelsInElement(child);
          }
        });
      }
    });
  };

  findLabelsInElement(root);

  // Find best matching label
  const matchingLabel = labels.find(label => 
    label._.trim().toLowerCase().includes(fieldName.toLowerCase()) ||
    label.$.fdtFieldName === fieldName
  );

  return matchingLabel ? matchingLabel._.trim() : '';
};

const findRadioLabel = (root, value) => {
  const textGroups = [];
  
  const findTextGroups = (element) => {
    if (!element) return;

    if (element.$ && 
        element.$.id && 
        element.$.id.includes('TextGroup')) {
      textGroups.push(element);
    }

    Object.keys(element).forEach(key => {
      if (Array.isArray(element[key])) {
        element[key].forEach(child => {
          if (child && typeof child === 'object') {
            findTextGroups(child);
          }
        });
      }
    });
  };

  findTextGroups(root);

  // Find text group containing the value
  for (const group of textGroups) {
    const text = findNestedText(group);
    if (text && text.includes(value)) {
      return text.trim();
    }
  }

  return '';
};

const findNestedText = (element) => {
  if (!element) return '';
  if (element._) return element._;
  
  for (const key in element) {
    if (Array.isArray(element[key])) {
      for (const child of element[key]) {
        const text = findNestedText(child);
        if (text) return text;
      }
    } else if (element[key] && typeof element[key] === 'object') {
      const text = findNestedText(element[key]);
      if (text) return text;
    }
  }
  
  return '';
};

const countRectElements = (group) => {
  let count = 0;

  const countRects = (element) => {
    if (!element) return;

    if (element.rect) {
      count += Array.isArray(element.rect) ? element.rect.length : 1;
    }

    Object.keys(element).forEach(key => {
      if (Array.isArray(element[key])) {
        element[key].forEach(child => {
          if (child && typeof child === 'object') {
            countRects(child);
          }
        });
      }
    });
  };

  countRects(group);
  return count || 20;
};