class Tax < ActiveRecord::Base
  acts_as_paranoid
  has_and_belongs_to_many :items, touch: true
  before_destroy :check_is_not_used

  validates :name, presence: true
  validates :value, presence: true, numericality: true

  private

  def check_is_not_used
    if items.count > 0
      errors.add(:base, "Can't delete a tax which is used in some invoices")
      throw(:abort)
    end
  end

  public

  def to_s
    name
  end

  def self.default
    self.where(active: true, default: true)
  end

  def self.enabled
    self.where(active: true)
  end

  def to_jbuilder
    Jbuilder.new do |json|
      json.(self, *(attribute_names - ["deleted_at"]))
    end
  end

  def self.ransackable_attributes(auth_object = nil)
    column_names
  end

  def self.ransackable_associations(auth_object = nil)
    reflect_on_all_associations.map { |a| a.name.to_s }
  end

end
