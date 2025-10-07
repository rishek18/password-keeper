import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const PasswordGenerator = ({ onPasswordGenerated }) => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookalikes, setExcludeLookalikes] = useState(true);

  const generatePassword = () => {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let lookalikes = 'il1Lo0O';

    if (includeNumbers) {
      charset += numbers;
    }
    if (includeSymbols) {
      charset += symbols;
    }
    if (excludeLookalikes) {
      charset = charset.split('').filter(char => !lookalikes.includes(char)).join('');
    }

    let newPassword = '';
    const cryptoObj = window.crypto || window.msCrypto;
    const randomValues = new Uint32Array(length);
    cryptoObj.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      newPassword += charset[randomValues[i] % charset.length];
    }

    setPassword(newPassword);
    if (onPasswordGenerated) {
      onPasswordGenerated(newPassword);
    }
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeNumbers, includeSymbols, excludeLookalikes]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success('Password copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy password');
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50" data-testid="password-generator">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Password Generator</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={generatePassword}
          data-testid="regenerate-password-btn"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={password}
          readOnly
          className="flex-1 px-3 py-2 border rounded-md bg-white font-mono text-sm"
          data-testid="generated-password"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          data-testid="copy-generated-password-btn"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-600">Length: {length}</Label>
          <Slider
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
            min={8}
            max={64}
            step={1}
            className="mt-2"
            data-testid="password-length-slider"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={includeNumbers}
              onCheckedChange={setIncludeNumbers}
              data-testid="include-numbers-checkbox"
            />
            <Label htmlFor="numbers" className="text-sm text-gray-700 cursor-pointer">
              Include Numbers
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={includeSymbols}
              onCheckedChange={setIncludeSymbols}
              data-testid="include-symbols-checkbox"
            />
            <Label htmlFor="symbols" className="text-sm text-gray-700 cursor-pointer">
              Include Symbols
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="lookalikes"
              checked={excludeLookalikes}
              onCheckedChange={setExcludeLookalikes}
              data-testid="exclude-lookalikes-checkbox"
            />
            <Label htmlFor="lookalikes" className="text-sm text-gray-700 cursor-pointer">
              Exclude Look-Alikes (i, l, 1, O, 0)
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
