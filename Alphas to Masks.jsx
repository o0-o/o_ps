////////////////////////////////////////////////////////////////////////////////
// `Alphas to Masks.jsx`
//
// Photoshop File Setup
//
// Copies alpha channels to masks on groups
//
// Compatibility:
// Photoshop 2017.1.3 RELEASE
//
// The MIT License (MIT)
// Copyright (c) 2018 dotDigital.digital
////////////////////////////////////////////////////////////////////////////////

// main
main();

// boilerplate
function main()
{
  // preserve config
  var origRulerUnits      = app.preferences.rulerUnits;
  var origTypeUnits       = app.preferences.typeUnits;
  var origDisplayDialogs  = app.displayDialogs;
  var origFGColorHex      = foregroundColor.rgb.hexValue;
  var origBGColorHex      = backgroundColor.rgb.hexValue;

  // set defaults
  app.preferences.rulerUnits  = Units.PIXELS; // Set the ruler units to PIXELS
  app.preferences.typeUnits   = TypeUnits.POINTS; // Set Type units to POINTS
  app.displayDialogs          = DialogModes.NO; // Set Dialogs off

  try {

    // main routine
    tbSetupFile();

  }
  // alert on error
  catch(e) { alert( e + ': on line ' + e.line, 'Script Error', true ); }

  // reset config
  app.displayDialogs            = origDisplayDialogs;
  app.preferences.typeUnits     = origTypeUnits;
  app.preferences.rulerUnits    = origRulerUnits;
  foregroundColor.rgb.hexValue  = origFGColorHex;
  backgroundColor.rgb.hexValue  = origBGColorHex;
}

// main routine
function tbSetupFile()
{
  // basic declarations
  var doc                 = app.activeDocument;
  var visibleChannelCount = 0
/*
  // background fill color
  fillColorHex            = "f6f6f8";
  fillColor               = new SolidColor;
  fillColor.rgb.hexValue  = fillColorHex;

  // basic layer sets

  var isolations  = doc.layerSets.add();
  isolations.name = "ISOLATIONS";

  while ( doc.artLayers.length > 0 )
  {
    i = doc.artLayers.length - 1;

    doc.artLayers[i].isBackgroundLayer = false;
    doc.artLayers[i].allLocked         = false;
    doc.artLayers[i].move( isolations, ElementPlacement.INSIDE );
  }

  var rt  = doc.layerSets.add();
  rt.name = "RT";

  var pixel   = rt.artLayers.add();
  pixel.name  = "PIXEL";

  rt.artLayers.add(); // newSolidFillRGB blows away an art layer if one is selected
  var db  = newSolidFillRGB( 128, 128, 128 );
  db.name = "DB";
  doc.rasterizeAllLayers();
  db.blendMode = BlendMode.SOFTLIGHT;

  var cc  = doc.layerSets.add();
  cc.name = "CC";

  var bg  = newSolidFillRGB( fillColor.rgb.red, fillColor.rgb.green, fillColor.rgb.blue );
  bg.name = fillColorHex.toUpperCase();
  bg.move( cc, ElementPlacement.PLACEBEFORE );

  var product   = cc.layerSets.add();
  product.name  = "Product";

  var shadow  = cc.layerSets.add();
  shadow.name = "Shadow";

  // combine BG and SHADOW masks for solid fill
  bgA     = doc.channels.getByName( "BG" );
  shadowA = doc.channels.getByName( "SHADOW" );

  doc.selection.load( shadowA, SelectionType.REPLACE, false );
  doc.selection.load( shadowA, SelectionType.EXTEND, false );
  doc.selection.load( shadowA, SelectionType.EXTEND, false ); // triple shadow mask density
  doc.selection.load( bgA, SelectionType.EXTEND, false );

  newLayerMask( bg, doc.selection, true );
*/
  // establish visible channels (will always be RGB, but whatever)
  switch (doc.mode)
  {
    case DocumentMode.BITMAP:
    case DocumentMode.GRAYSCALE:
    case DocumentMode.INDEXEDCOLOR:
      visibleChannelCount = 1
    break;

    case DocumentMode.DUOTONE:
      visibleChannelCount = 2
    break;

    case DocumentMode.RGB:
    case DocumentMode.LAB:
      visibleChannelCount = 3
    break;

    case DocumentMode.CMYK:
      visibleChannelCount = 4
    break;

    case DocumentMode.MULTICHANNEL:
    default:
      visibleChannelCount = inDocument.channels.length + 1
    break;
  }

  // loop through alphas
  for ( var i=visibleChannelCount; i < doc.channels.length; i++ )
  {
/*
    // filter alphas by name
    switch ( doc.channels[i].name.toUpperCase() )
    {
      // SHADOW alpha is only used on bg color fill
      case "SHADOW":
      break;

      // shadow group is actually a mask of the background
      // BG mask is used for product
      case "BG":
        newLayerMask( shadow, doc.channels[i], true );
        newLayerMask( product, doc.channels[i], false );
      break;

      // all other alphas are added inside product group
      default:
*/
        var newLayerSet  = doc.layerSets.add();
        newLayerSet.name = doc.channels[i].name;
        newLayerMask( newLayerSet, doc.channels[i], false );
/*
      break;
    }
*/
  }
/*
  // select isolations group
  doc.activeLayer = isolations;
*/
}
/*
// duplicate document and merge layers
function duplicateDocument( doc, name )
{
  return doc.duplicate( name, false );
}

// create solid fill layer from RGB values
function newSolidFillRGB( red, green, blue )
{
  var idMk            = charIDToTypeID( "Mk  " );
  var desc15          = new ActionDescriptor();
  var idnull          = charIDToTypeID( "null" );
  var ref4            = new ActionReference();
  var idcontentLayer  = stringIDToTypeID( "contentLayer" );
  ref4.putClass( idcontentLayer );
  desc15.putReference( idnull, ref4 );

  var idUsng  = charIDToTypeID( "Usng" );
  var desc16  = new ActionDescriptor();
  var idType  = charIDToTypeID( "Type" );
  var desc17  = new ActionDescriptor();
  var idClr   = charIDToTypeID( "Clr " );
  var desc18  = new ActionDescriptor();
  var idRd    = charIDToTypeID( "Rd  " );
  desc18.putDouble( idRd, red);//Red variable

  var idGrn = charIDToTypeID( "Grn " );
  desc18.putDouble( idGrn, green);//green variable

  var idBl = charIDToTypeID( "Bl  " );
  desc18.putDouble( idBl, blue );//blue variable

  var idRGBC = charIDToTypeID( "RGBC" );
  desc17.putObject( idClr, idRGBC, desc18 );

  var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
  desc16.putObject( idType, idsolidColorLayer, desc17 );

  var idcontentLayer = stringIDToTypeID( "contentLayer" );
  desc15.putObject( idUsng, idcontentLayer, desc16 );

  executeAction( idMk, desc15, DialogModes.NO );

  return app.activeDocument.activeLayer;
}
*/

// creates layer mask from alpha or selection
function newLayerMask( layer, alphaOrSelection, invert )
{
  // set active layer
  app.activeDocument.activeLayer = layer;

  // determine if alpha or selection was passed
  if ( alphaOrSelection.typename == "Channel" )
  {
    app.activeDocument.selection.load( alphaOrSelection, SelectionType.REPLACE, invert );
  }
  else {
    if ( invert )
    {
      alphaOrSelection = alphaOrSelection.invert();
    }
    app.activeDocument.selection=alphaOrSelection;
  }

  var idMk    = charIDToTypeID( "Mk  " );
  var desc5   = new ActionDescriptor();
  var idNw    = charIDToTypeID( "Nw  " );
  var idChnl  = charIDToTypeID( "Chnl" );
  desc5.putClass( idNw, idChnl );

  var idAt    = charIDToTypeID( "At  " );
  var ref4    = new ActionReference();
  var idChnl  = charIDToTypeID( "Chnl" );
  var idChnl  = charIDToTypeID( "Chnl" );
  var idMsk   = charIDToTypeID( "Msk " );
  ref4.putEnumerated( idChnl, idChnl, idMsk );
  desc5.putReference( idAt, ref4 );

  var idUsng = charIDToTypeID( "Usng" );
  var idUsrM = charIDToTypeID( "UsrM" );
  var idRvlS = charIDToTypeID( "RvlS" );
  desc5.putEnumerated( idUsng, idUsrM, idRvlS );

  executeAction( idMk, desc5, DialogModes.NO );

  // deselect
  app.activeDocument.selection.deselect();

  return;
}
