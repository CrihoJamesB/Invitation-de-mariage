import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import Card from "../common/Card"
import Button from "../common/Button"

/**
 * Formulaire pour ajouter ou modifier un invité
 */
const GuestForm = ({ guest, groups, onSubmit, onCancel }) => {
  // État du formulaire avec valeurs par défaut ou valeurs de l'invité à modifier
  const [formData, setFormData] = useState({
    name: "",
    group: groups[0] || "",
    count: 1,
    message: "",
    ...guest,
  })

  // Mettre à jour le formulaire si l'invité change
  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name || "",
        group: guest.group || groups[0] || "",
        count: guest.count || 1,
        message: guest.message || "",
        ...guest,
      })
    }
  }, [guest, groups])

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "count" ? parseInt(value, 10) : value,
    }))
  }

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card
      variant="default"
      className="overflow-hidden"
    >
      <form onSubmit={handleSubmit}>
        <Card.Body className="p-6">
          <h3 className="text-xl font-elegant text-primary-dark mb-4">
            {guest ? "Modifier l&apos;invité" : "Ajouter un invité"}
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-primary-dark mb-1"
              >
                Nom de l&apos;invité
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary bg-white text-primary-dark"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom de l'invité ou du groupe"
              />
            </div>

            <div>
              <label
                htmlFor="group"
                className="block text-sm font-medium text-primary-dark mb-1"
              >
                Groupe
              </label>
              <select
                id="group"
                name="group"
                required
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary bg-white text-primary-dark"
                value={formData.group}
                onChange={handleChange}
              >
                {groups.map((group) => (
                  <option
                    key={group}
                    value={group}
                  >
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="count"
                className="block text-sm font-medium text-primary-dark mb-1"
              >
                Nombre de personnes
              </label>
              <input
                id="count"
                name="count"
                type="number"
                min="1"
                required
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary bg-white text-primary-dark"
                value={formData.count}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-primary-dark mb-1"
              >
                Message personnalisé
              </label>
              <textarea
                id="message"
                name="message"
                rows="3"
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary bg-white text-primary-dark"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message personnalisé pour cet invité"
              ></textarea>
            </div>
          </div>
        </Card.Body>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            {guest ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Card>
  )
}

// Définir les PropTypes pour la validation des props
GuestForm.propTypes = {
  guest: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    group: PropTypes.string,
    count: PropTypes.number,
    message: PropTypes.string,
  }),
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

// Valeurs par défaut
GuestForm.defaultProps = {
  guest: null,
}

export default GuestForm
