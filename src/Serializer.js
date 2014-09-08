// The MIT License (MIT)
//
// Copyright (c) 2013 David Evans
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// ## Serializer
// Serializers are simple classes that all conform to a single interface, and
// either read or write data to a particular format. Currently there are only
// serializers for reading and writing JSON objects, but any format could be
// supported in the future.

// The serializer interface is as follows.
// `void Serializer.property(obj, propertyName, defaultValue)`
// Serializes (reads or writes) a single property of an object.
// `obj` - The object to serialize a property of.
// `propertyName` - The string name of the property to serialize.
// `defaultValue` - A value to serialize into the property if none is specified. Note that
// this only has meaning in the case of reading.
//
// `string Serializer.mode`
// Defines whether the current mode of the serializer is `read` or `write`. Useful in the case where
// your object needs to serialize different things depending on the mode.
(function(TANK)
{
  // ## Write Serializer
  TANK.WriteSerializer = function()
  {
    this.mode = 'write';
    this._writeObj = {};
  };

  TANK.WriteSerializer.prototype.property = function(obj, propertyName, defaultValue)
  {
    this._writeObj[propertyName] = obj[propertyName];
  };

  // ## Read Serializer
  TANK.ReadSerializer = function(readObj)
  {
    this.mode = 'read';
    this._readObj = readObj;
  };

  TANK.ReadSerializer.prototype.property = function(obj, propertyName, defaultValue)
  {
    var val = this._readObj[propertyName];
    obj[propertyName] = typeof val !== 'undefined' ? val : defaultValue;
  };

})(typeof exports === "undefined" ? (this.TANK = this.TANK || {}) : exports);