import { Shield, AlertTriangle } from "lucide-react";
import {
  BIOMETRIC_CONSENT_SUMMARY,
  HEALTH_CONSENT_SUMMARY,
  PRIVACY_POLICY_SUMMARY,
  TERMS_OF_USE_SUMMARY,
} from "../../constants/terms";

interface ConsentCheckboxProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

function ConsentCheckbox({
  id,
  label,
  description,
  checked,
  onChange,
  required,
}: ConsentCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 bg-neutral-900 border border-neutral-700 rounded-md p-4 cursor-pointer hover:border-neutral-600 transition-colors"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 accent-yellow-400 shrink-0"
      />
      <div>
        <p className="text-white text-sm font-semibold">
          {label}
          {required && <span className="text-orange-500 ml-1">*</span>}
        </p>
        <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </label>
  );
}

interface TermsConsentFormProps {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  healthConsent: boolean;
  biometricConsent: boolean;
  onTermsChange: (value: boolean) => void;
  onPrivacyChange: (value: boolean) => void;
  onHealthChange: (value: boolean) => void;
  onBiometricChange: (value: boolean) => void;
  showBiometric?: boolean;
  showHealth?: boolean;
}

export function TermsConsentForm({
  termsAccepted,
  privacyAccepted,
  healthConsent,
  biometricConsent,
  onTermsChange,
  onPrivacyChange,
  onHealthChange,
  onBiometricChange,
  showBiometric = true,
  showHealth = true,
}: TermsConsentFormProps) {
  const canProceed =
    termsAccepted && privacyAccepted && (!showHealth || healthConsent);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="text-yellow-400" size={20} />
        <h3 className="text-white font-bold uppercase text-sm tracking-wide">
          Termos e consentimentos LGPD
        </h3>
      </div>

      <ConsentCheckbox
        id="terms"
        label="Li e aceito os Termos de Uso"
        description={TERMS_OF_USE_SUMMARY}
        checked={termsAccepted}
        onChange={onTermsChange}
        required
      />

      <ConsentCheckbox
        id="privacy"
        label="Li e aceito a Política de Privacidade"
        description={PRIVACY_POLICY_SUMMARY}
        checked={privacyAccepted}
        onChange={onPrivacyChange}
        required
      />

      {showHealth && (
        <ConsentCheckbox
          id="health"
          label="Consentimento específico — dados de saúde (PAR-Q)"
          description={HEALTH_CONSENT_SUMMARY}
          checked={healthConsent}
          onChange={onHealthChange}
          required
        />
      )}

      {showBiometric && (
        <ConsentCheckbox
          id="biometric"
          label="Consentimento opcional — biometria facial (check-in)"
          description={BIOMETRIC_CONSENT_SUMMARY}
          checked={biometricConsent}
          onChange={onBiometricChange}
        />
      )}

      {!canProceed && (
        <div className="flex items-start gap-2 text-orange-400 text-xs bg-orange-500/10 border border-orange-500/20 rounded-md p-3">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <p>
            Todos os consentimentos obrigatórios devem ser aceitos explicitamente
            (checkboxes não vêm pré-marcados) para concluir o cadastro.
          </p>
        </div>
      )}
    </div>
  );
}

export function canProceedWithTerms(
  termsAccepted: boolean,
  privacyAccepted: boolean,
  healthConsent: boolean,
  requireHealth = true
): boolean {
  return (
    termsAccepted && privacyAccepted && (!requireHealth || healthConsent)
  );
}
