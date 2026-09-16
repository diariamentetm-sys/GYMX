import { Shield, AlertTriangle } from "lucide-react";
import {
  BIOMETRIC_CONSENT,
  BIOMETRIC_CONSENT_SUMMARY,
  HEALTH_CONSENT,
  HEALTH_CONSENT_SUMMARY,
  PRIVACY_POLICY,
  PRIVACY_POLICY_SUMMARY,
  TERMS_OF_USE,
  TERMS_OF_USE_SUMMARY,
} from "../../constants/terms";

interface ConsentDocumentProps {
  id: string;
  label: string;
  summary: string;
  body: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

function ConsentDocument({
  id,
  label,
  summary,
  body,
  checked,
  onChange,
  required,
}: ConsentDocumentProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-md overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-neutral-800">
        <p className="text-white text-sm font-semibold">
          {label}
          {required ? <span className="text-orange-500 ml-1">*</span> : (
            <span className="text-neutral-500 font-medium ml-2 text-xs uppercase tracking-wider">
              Opcional
            </span>
          )}
        </p>
        <p className="text-neutral-400 text-xs mt-1 leading-relaxed">{summary}</p>
      </div>

      <div
        className="max-h-56 overflow-y-auto px-4 py-4 text-neutral-300 text-xs leading-relaxed whitespace-pre-wrap scrollbar-thin"
        tabIndex={0}
        role="region"
        aria-label={label}
      >
        {body.trim()}
      </div>

      <label
        htmlFor={id}
        className="flex items-start gap-3 px-4 py-3 border-t border-neutral-800 cursor-pointer hover:bg-neutral-800/40 transition-colors"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-yellow-400 shrink-0"
        />
        <span className="text-neutral-200 text-xs leading-relaxed">
          Li o documento completo acima e aceito seus termos.
        </span>
      </label>
    </div>
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

      <ConsentDocument
        id="terms"
        label="Termos de Uso"
        summary={TERMS_OF_USE_SUMMARY}
        body={TERMS_OF_USE}
        checked={termsAccepted}
        onChange={onTermsChange}
        required
      />

      <ConsentDocument
        id="privacy"
        label="Política de Privacidade"
        summary={PRIVACY_POLICY_SUMMARY}
        body={PRIVACY_POLICY}
        checked={privacyAccepted}
        onChange={onPrivacyChange}
        required
      />

      {showHealth && (
        <ConsentDocument
          id="health"
          label="Consentimento específico — dados de saúde (PAR-Q)"
          summary={HEALTH_CONSENT_SUMMARY}
          body={HEALTH_CONSENT}
          checked={healthConsent}
          onChange={onHealthChange}
          required
        />
      )}

      {showBiometric && (
        <ConsentDocument
          id="biometric"
          label="Consentimento — biometria facial (check-in)"
          summary={BIOMETRIC_CONSENT_SUMMARY}
          body={BIOMETRIC_CONSENT}
          checked={biometricConsent}
          onChange={onBiometricChange}
        />
      )}

      {!canProceed && (
        <div className="flex items-start gap-2 text-orange-400 text-xs bg-orange-500/10 border border-orange-500/20 rounded-md p-3">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <p>
            Role cada documento, leia o texto completo e marque o aceite. Os
            obrigatórios não vêm pré-marcados.
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
